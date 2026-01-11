import Link from 'next/link'
import { Store } from 'lucide-react'

export default function ImprintPage() {
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
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-12">Imprint</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Company Information</h2>
            <div className="text-gray-600 leading-relaxed space-y-2">
              <p><strong className="text-gray-900">Company Name:</strong> Livero GmbH</p>
              <p><strong className="text-gray-900">Address:</strong> Hauptstraße 1, 1010 Vienna, Austria</p>
              <p><strong className="text-gray-900">Registration Number:</strong> FN 123456a</p>
              <p><strong className="text-gray-900">VAT ID:</strong> ATU12345678</p>
              <p><strong className="text-gray-900">Commercial Register:</strong> Vienna Commercial Court</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Contact</h2>
            <div className="text-gray-600 leading-relaxed space-y-2">
              <p><strong className="text-gray-900">Email:</strong> info@livero.com</p>
              <p><strong className="text-gray-900">Phone:</strong> +43 1 234 5678</p>
              <p><strong className="text-gray-900">Website:</strong> www.livero.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Managing Director</h2>
            <p className="text-gray-600 leading-relaxed">
              [Name of Managing Director]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Supervisory Authority</h2>
            <p className="text-gray-600 leading-relaxed">
              Magistrat der Stadt Wien, MA 63 - Gewerberechtliche Angelegenheiten
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Dispute Resolution</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The European Commission provides a platform for online dispute resolution (OS):
            </p>
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              https://ec.europa.eu/consumers/odr
            </a>
            <p className="text-gray-600 leading-relaxed mt-4">
              We are not willing or obliged to participate in dispute resolution proceedings before a consumer
              arbitration board.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Liability for Content</h2>
            <p className="text-gray-600 leading-relaxed">
              As a service provider, we are responsible for our own content on these pages in accordance with
              general legislation. However, we are not obliged to monitor transmitted or stored third-party
              information or to investigate circumstances that indicate illegal activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Liability for Links</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website contains links to external third-party websites over whose content we have no influence.
              Therefore, we cannot assume any liability for this third-party content. The respective provider or
              operator of the pages is always responsible for the content of the linked pages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Copyright</h2>
            <p className="text-gray-600 leading-relaxed">
              The content and works created by the site operators on these pages are subject to Austrian copyright
              law. Duplication, processing, distribution, and any form of commercialization of such material beyond
              the scope of copyright law requires the written consent of its respective author or creator.
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

