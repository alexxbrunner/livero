#!/usr/bin/env python3
"""
Scrape manufacturer information from moebelfirst.de product pages.
Uses concurrent requests with 40 workers to extract unique company information including addresses.
"""

import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
import re
import sys
import json
from typing import Set, Optional, Dict, Any
from dataclasses import dataclass, asdict

SITEMAP_URL = "https://www.moebelfirst.de/sitemap/c1aedaadc2d54272bc6b5450488a895e/products/product-sitemap0.xml"
MAX_WORKERS = 40
TIMEOUT = 30  # seconds


@dataclass
class ManufacturerInfo:
    """Manufacturer information structure."""
    name: str
    address: str = ""
    postal_code: str = ""
    city: str = ""
    country: str = ""
    email: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'name': self.name,
            'address': self.address,
            'postal_code': self.postal_code,
            'city': self.city,
            'country': self.country,
            'email': self.email
        }
    
    def __hash__(self):
        """Make hashable based on name for set operations."""
        return hash(self.name.lower().strip())
    
    def __eq__(self, other):
        """Compare based on name."""
        if not isinstance(other, ManufacturerInfo):
            return False
        return self.name.lower().strip() == other.name.lower().strip()
    
    def to_string(self) -> str:
        """Convert to string representation for display."""
        parts = [self.name]
        if self.address:
            parts.append(self.address)
        if self.postal_code or self.city:
            city_parts = []
            if self.postal_code:
                city_parts.append(self.postal_code)
            if self.city:
                city_parts.append(self.city)
            if city_parts:
                parts.append(' '.join(city_parts))
        if self.country:
            parts.append(self.country)
        if self.email:
            parts.append(self.email)
        return ' | '.join(parts)


def get_product_urls(sitemap_url: str) -> list[str]:
    """Fetch and parse sitemap XML to extract all product URLs."""
    print(f"Fetching sitemap from {sitemap_url}...")
    response = requests.get(sitemap_url, timeout=TIMEOUT)
    response.raise_for_status()
    
    root = ET.fromstring(response.content)
    # Sitemap namespace
    ns = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    
    urls = []
    for url_elem in root.findall('.//ns:url', ns):
        loc_elem = url_elem.find('ns:loc', ns)
        if loc_elem is not None and loc_elem.text:
            urls.append(loc_elem.text.strip())
    
    print(f"Found {len(urls)} product URLs in sitemap")
    return urls


def extract_manufacturer(html_content: str, url: str) -> Optional[ManufacturerInfo]:
    """Extract complete manufacturer information from product page HTML."""
    try:
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Find the manufacturer information section
        manufacturer_section = soup.find('div', class_='product-detail-content-manufacturer-information')
        if not manufacturer_section:
            return None
        
        # Find the column that contains the manufacturer info
        column = manufacturer_section.find('div', class_='ott-manufacturer-information-column')
        if not column:
            return None
        
        # Find the title "Hersteller:"
        title = column.find('div', class_='ott-manufacturer-information-title')
        if not title or 'Hersteller:' not in title.get_text():
            return None
        
        # Initialize variables
        name = ""
        address = ""
        postal_code = ""
        city = ""
        country = ""
        email = ""
        
        # Extract name: text directly after title div, before first <br>
        current = title.next_sibling
        name_parts = []
        while current:
            if hasattr(current, 'name') and current.name == 'br':
                break
            if isinstance(current, str):
                text = current.strip()
                if text:
                    name_parts.append(text)
            current = current.next_sibling
        
        if name_parts:
            name = ' '.join(name_parts).strip()
            name = unescape(name)
            name = re.sub(r'\s+', ' ', name)
        
        if not name or len(name) < 2:
            return None
        
        # Get all text from column and parse by lines
        # Structure: Hersteller:\nName\nAddress\nPostalCode\nCity\nCountry\nEmail
        column_text = column.get_text(separator='\n', strip=True)
        lines = [line.strip() for line in column_text.split('\n') if line.strip() and line.strip() != 'Hersteller:']
        
        # Find name in lines (first line after "Hersteller:")
        name_line_idx = -1
        for i, line in enumerate(lines):
            if name.lower() in line.lower() or (len(name) > 10 and line.lower().startswith(name[:10].lower())):
                name_line_idx = i
                break
        
        if name_line_idx >= 0:
            # Extract address (next line after name, if it doesn't look like postal code or email)
            if name_line_idx + 1 < len(lines):
                next_line = lines[name_line_idx + 1]
                if not re.match(r'^\d{4,5}$', next_line) and '@' not in next_line:
                    address = unescape(next_line)
                    address = re.sub(r'\s+', ' ', address)
            
            # Extract postal code, city, country (in sequence after address)
            idx = name_line_idx + 2
            while idx < len(lines):
                line = lines[idx].strip()
                if not line:
                    idx += 1
                    continue
                
                # Check for postal code (4-5 digits)
                if re.match(r'^\d{4,5}$', line):
                    postal_code = line
                    # Next line is likely city
                    if idx + 1 < len(lines):
                        city_line = lines[idx + 1].strip()
                        if city_line and not re.match(r'^\d', city_line) and '@' not in city_line:
                            city = unescape(city_line)
                            idx += 2
                            continue
                    idx += 1
                    continue
                
                # Check for country (common country names)
                country_keywords = ['Deutschland', 'Germany', 'Österreich', 'Austria', 'Schweiz', 'Switzerland', 
                                  'Italy', 'Italien', 'France', 'Frankreich', 'Spain', 'Spanien']
                if any(kw.lower() in line.lower() for kw in country_keywords):
                    country = unescape(line)
                    idx += 1
                    continue
                
                # Check for email
                if '@' in line and '.' in line:
                    email = unescape(line)
                    idx += 1
                    continue
                
                idx += 1
        
        # Also parse HTML structure directly as fallback
        # Get all text nodes and divs after title
        current = title.next_sibling
        parts_collected = []
        while current:
            if hasattr(current, 'name'):
                if current.name == 'div':
                    div_text = current.get_text(strip=True)
                    if div_text:
                        parts_collected.append(div_text)
            elif isinstance(current, str):
                text = current.strip()
                if text:
                    parts_collected.append(text)
            current = current.next_sibling
        
        # Use collected parts to fill in missing fields
        if parts_collected:
            for part in parts_collected:
                part_clean = part.strip()
                # Postal code
                if not postal_code and re.match(r'^\d{4,5}$', part_clean):
                    postal_code = part_clean
                # Email
                elif not email and '@' in part_clean and '.' in part_clean:
                    email = unescape(part_clean)
                # Country
                elif not country:
                    country_keywords = ['Deutschland', 'Germany', 'Österreich', 'Austria', 'Schweiz', 'Switzerland']
                    if any(kw.lower() in part_clean.lower() for kw in country_keywords):
                        country = unescape(part_clean)
                # Address (if not set and doesn't match name)
                elif not address and part_clean.lower() != name.lower() and not re.match(r'^\d', part_clean) and '@' not in part_clean:
                    address = unescape(part_clean)
                    address = re.sub(r'\s+', ' ', address)
                # City (if not set)
                elif not city and not re.match(r'^\d', part_clean) and '@' not in part_clean and part_clean.lower() != name.lower():
                    city = unescape(part_clean)
        
        # Clean up
        name = name.strip() if name else ""
        address = address.strip() if address else ""
        postal_code = postal_code.strip() if postal_code else ""
        city = city.strip() if city else ""
        country = country.strip() if country else ""
        email = email.strip() if email else ""
        
        if name and len(name) > 2:
            return ManufacturerInfo(
                name=name,
                address=address,
                postal_code=postal_code,
                city=city,
                country=country,
                email=email
            )
                
    except Exception as e:
        print(f"Error parsing HTML from {url}: {e}")
    
    return None


def scrape_product(url: str) -> tuple[str, Optional[ManufacturerInfo]]:
    """Scrape a single product page and return (url, manufacturer_info)."""
    try:
        response = requests.get(url, timeout=TIMEOUT, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        response.raise_for_status()
        manufacturer = extract_manufacturer(response.text, url)
        return (url, manufacturer)
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return (url, None)


def main():
    """Main function to orchestrate the scraping."""
    print("Starting manufacturer scraping...")
    print(f"Using {MAX_WORKERS} concurrent workers")
    print()
    
    # Get all product URLs from sitemap
    product_urls = get_product_urls(SITEMAP_URL)
    
    if not product_urls:
        print("No product URLs found in sitemap!")
        return
    
    # Scrape all products concurrently
    manufacturers: Set[ManufacturerInfo] = set()
    processed = 0
    failed = 0
    output_file = "manufacturers.json"
    
    print(f"\nScraping {len(product_urls)} product pages...")
    print(f"Results will be streamed to: {output_file}")
    print()
    
    # Open file for streaming JSON (JSONL format - one JSON object per line)
    with open(output_file, 'w', encoding='utf-8') as f:
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            # Submit all tasks
            future_to_url = {executor.submit(scrape_product, url): url for url in product_urls}
            
            # Process completed tasks and stream results in real-time
            for future in as_completed(future_to_url):
                url, manufacturer = future.result()
                processed += 1
                
                if manufacturer:
                    is_new = manufacturer not in manufacturers
                    manufacturers.add(manufacturer)
                    if is_new:
                        # Stream to console
                        print(f"[{processed}/{len(product_urls)}] ✓ New: {manufacturer.to_string()}", flush=True)
                        # Stream to file as JSON (JSONL format - one object per line)
                        json_line = json.dumps(manufacturer.to_dict(), ensure_ascii=False)
                        f.write(json_line + '\n')
                        f.flush()  # Ensure it's written to disk immediately
                else:
                    failed += 1
                
                # Progress update every 50 pages
                if processed % 50 == 0:
                    print(f"[Progress: {processed}/{len(product_urls)} processed | {len(manufacturers)} unique manufacturers | {failed} failed]", flush=True)
    
    # Output results
    print("\n" + "="*80)
    print(f"SCRAPING COMPLETE")
    print("="*80)
    print(f"Total products processed: {processed}")
    print(f"Products with manufacturer info: {processed - failed}")
    print(f"Products without manufacturer info: {failed}")
    print(f"Unique manufacturers found: {len(manufacturers)}")
    print("\n" + "="*80)
    print("UNIQUE MANUFACTURERS:")
    print("="*80)
    
    # Sort manufacturers alphabetically by name
    sorted_manufacturers = sorted(manufacturers, key=lambda m: m.name.lower())
    for i, manufacturer in enumerate(sorted_manufacturers, 1):
        print(f"{i}. {manufacturer.to_string()}")
    
    print("\n" + "="*80)
    print(f"\nResults streamed to: {output_file} (JSONL format - one JSON object per line)")
    print(f"Note: File was written in real-time. Total unique manufacturers: {len(manufacturers)}")
    print(f"Each line is a valid JSON object with fields: name, address, postal_code, city, country, email")


if __name__ == "__main__":
    main()

