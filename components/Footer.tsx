import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-6">
              <span className="text-2xl font-serif font-bold text-white tracking-tight">LIVERO</span>
              <p className="text-xs text-neutral-500 mt-1 tracking-widest uppercase">Premium Interiors</p>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Curating exceptional furniture from Europe's finest stores.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/categories" className="hover:text-white transition-colors">All Categories</Link></li>
              <li><Link href="/city/vienna" className="hover:text-white transition-colors">Vienna</Link></li>
              <li><Link href="/city/munich" className="hover:text-white transition-colors">Munich</Link></li>
              <li><Link href="/city/berlin" className="hover:text-white transition-colors">Berlin</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/imprint" className="hover:text-white transition-colors">Imprint</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 text-center text-sm text-neutral-500">
          <p>© 2026 Livero. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

