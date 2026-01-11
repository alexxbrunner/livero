import Link from 'next/link'
import { Store } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <Store className="w-10 h-10 text-primary-600" />
              <span className="text-3xl font-serif font-bold text-gray-900">Livero</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-12">Last updated: January 11, 2026</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Livero ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Account information (email, password)</li>
              <li>Store information (name, description, logo)</li>
              <li>E-commerce platform credentials (encrypted)</li>
              <li>Contact information</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Product views and clicks</li>
              <li>Usage analytics</li>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To sync product inventories</li>
              <li>To provide analytics to store owners</li>
              <li>To improve our platform</li>
              <li>To communicate with you</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">4. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Service Providers:</strong> Third-party services that help us operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or asset sale</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>Encrypted storage of sensitive credentials</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">7. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar technologies to improve your experience. See our{' '}
              <Link href="/cookies" className="text-primary-600 hover:text-primary-700 underline">
                Cookie Policy
              </Link>{' '}
              for details.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our platform is not intended for children under 16. We do not knowingly collect information from
              children under 16.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-900 font-medium mt-4">
              Email: privacy@livero.com<br />
              Address: Livero GmbH, Hauptstraße 1, 1010 Vienna, Austria
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

