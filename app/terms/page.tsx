import Link from 'next/link'
import { Store } from 'lucide-react'

export default function TermsPage() {
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
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-12">Last updated: January 11, 2026</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using Livero, you agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use our platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Livero is a city-based interior and furniture aggregation platform that connects local furniture
              stores with customers through a unified marketplace.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">3. Store Membership</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Registration</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Stores must register and provide accurate information. Each store must be approved by Livero
              before activation.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Monthly Fee</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Stores pay a fixed monthly fee as specified for their city (typically €500)</li>
              <li>80% of the fee goes to the city marketing fund</li>
              <li>20% is retained as platform fee</li>
              <li>Fees are non-refundable</li>
              <li>Payment is due at the beginning of each month</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Inventory Sync</h3>
            <p className="text-gray-600 leading-relaxed">
              Stores authorize Livero to access their e-commerce platform for inventory synchronization. Stores
              are responsible for maintaining accurate and up-to-date product information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">4. Prohibited Conduct</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You may not:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide false or misleading information</li>
              <li>Upload counterfeit or illegal products</li>
              <li>Manipulate views or click metrics</li>
              <li>Interfere with the platform's operation</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Access other stores' credentials or data</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Stores retain ownership of their product images, descriptions, and branding. By using Livero, stores
              grant us a license to display this content on our platform.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Livero retains all rights to the platform, including its design, code, and trademarks.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">6. Termination</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We reserve the right to suspend or terminate accounts that violate these terms. Stores may cancel
              their membership with 30 days' notice.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">7. Disclaimers</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Livero is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Uninterrupted or error-free service</li>
              <li>Specific sales or traffic results</li>
              <li>Complete accuracy of synced inventory</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              Livero shall not be liable for any indirect, incidental, special, or consequential damages arising
              from use of the platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">9. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These terms are governed by the laws of Austria. Disputes shall be resolved in Vienna, Austria.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">10. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these Terms, contact us at:
            </p>
            <p className="text-gray-900 font-medium mt-4">
              Email: legal@livero.com<br />
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

