#!/usr/bin/env python3
"""
Scrape manufacturer information from moebelfirst.de product pages.
Uses concurrent requests with 20 workers to extract unique company names.
"""

import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
import re
from typing import Set, Optional

SITEMAP_URL = "https://www.moebelfirst.de/sitemap/c1aedaadc2d54272bc6b5450488a895e/products/product-sitemap0.xml"
MAX_WORKERS = 20
TIMEOUT = 30  # seconds


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


def extract_manufacturer(html_content: str, url: str) -> Optional[str]:
    """Extract manufacturer name from product page HTML."""
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
        
        # Method 1: Get text directly after the title element (before first <br>)
        # In the HTML structure, the manufacturer name comes right after the title div
        title_text_nodes = []
        for node in title.next_siblings:
            # Check if it's a <br> tag
            if hasattr(node, 'name') and node.name == 'br':
                break
            # Collect text nodes
            if isinstance(node, str):
                text = node.strip()
                if text:
                    title_text_nodes.append(text)
            elif hasattr(node, 'get_text'):
                # If there's a nested element, get its text
                text = node.get_text(strip=True)
                if text:
                    title_text_nodes.append(text)
        
        if title_text_nodes:
            manufacturer = ' '.join(title_text_nodes).strip()
            if manufacturer:
                manufacturer = unescape(manufacturer)
                manufacturer = re.sub(r'\s+', ' ', manufacturer)
                # Take only the first meaningful line (before address info)
                manufacturer = manufacturer.split('\n')[0].strip()
                if manufacturer and len(manufacturer) > 2:
                    return manufacturer
        
        # Method 2: Extract from full column text using regex
        # Split by newlines and find the line after "Hersteller:"
        column_text = column.get_text(separator='\n', strip=True)
        lines = column_text.split('\n')
        
        for i, line in enumerate(lines):
            if 'Hersteller:' in line and i + 1 < len(lines):
                # Next line should be the manufacturer name
                manufacturer = lines[i + 1].strip()
                if manufacturer:
                    manufacturer = unescape(manufacturer)
                    manufacturer = re.sub(r'\s+', ' ', manufacturer)
                    # Remove address patterns (postal codes, etc.)
                    manufacturer = re.sub(r'\s+\d{4,}\s+.*$', '', manufacturer)
                    if manufacturer and len(manufacturer) > 2:
                        return manufacturer
        
        # Method 3: Regex fallback
        all_text = column.get_text()
        match = re.search(r'Hersteller:\s*([^\n<]+?)(?:\n|$)', all_text, re.IGNORECASE)
        if match:
            manufacturer = match.group(1).strip()
            manufacturer = unescape(manufacturer)
            manufacturer = re.sub(r'\s+', ' ', manufacturer)
            # Remove address parts
            manufacturer = re.sub(r'\s+\d{4,}.*$', '', manufacturer)
            if manufacturer and len(manufacturer) > 2:
                return manufacturer
                
    except Exception as e:
        print(f"Error parsing HTML from {url}: {e}")
    
    return None


def scrape_product(url: str) -> tuple[str, Optional[str]]:
    """Scrape a single product page and return (url, manufacturer)."""
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
    manufacturers: Set[str] = set()
    processed = 0
    failed = 0
    
    print(f"\nScraping {len(product_urls)} product pages...")
    print()
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        # Submit all tasks
        future_to_url = {executor.submit(scrape_product, url): url for url in product_urls}
        
        # Process completed tasks
        for future in as_completed(future_to_url):
            url, manufacturer = future.result()
            processed += 1
            
            if manufacturer:
                is_new = manufacturer not in manufacturers
                manufacturers.add(manufacturer)
                if is_new:
                    print(f"[{processed}/{len(product_urls)}] ✓ New: {manufacturer}")
            else:
                failed += 1
            
            # Progress update every 100 pages
            if processed % 100 == 0:
                print(f"\nProgress: {processed}/{len(product_urls)} processed | {len(manufacturers)} unique manufacturers found | {failed} failed\n")
    
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
    
    # Sort manufacturers alphabetically
    sorted_manufacturers = sorted(manufacturers, key=str.lower)
    for i, manufacturer in enumerate(sorted_manufacturers, 1):
        print(f"{i}. {manufacturer}")
    
    print("\n" + "="*80)
    
    # Also save to a file
    output_file = "manufacturers.txt"
    with open(output_file, 'w', encoding='utf-8') as f:
        for manufacturer in sorted_manufacturers:
            f.write(f"{manufacturer}\n")
    
    print(f"\nResults saved to: {output_file}")


if __name__ == "__main__":
    main()

