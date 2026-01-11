'use client'

import { useState } from 'react'
import DefaultLayout from '@/components/DefaultLayout'
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      toast.success('Message sent successfully!')
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (submitted) {
    return (
      <DefaultLayout>
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
          <div className="max-w-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-serif font-medium text-neutral-900 mb-4">
              Message Sent!
            </h1>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              Thank you for contacting us. Our support team will get back to you within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({ name: '', email: '', subject: '', message: '' })
              }}
              className="btn-primary"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-full mb-6">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-neutral-900 mb-6">
            Contact Support
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Have a question or need assistance? Our team is here to help you find the perfect piece for your home.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-serif font-medium text-neutral-900 mb-8">
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-1">Email</h3>
                    <a href="mailto:support@livero.com" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                      support@livero.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-1">Phone</h3>
                    <a href="tel:+43123456789" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                      +43 1 234 5678
                    </a>
                    <p className="text-sm text-neutral-500 mt-1">Mon-Fri, 9am-6pm CET</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-1">Office</h3>
                    <p className="text-neutral-600">
                      Ringstraße 1<br />
                      1010 Vienna<br />
                      Austria
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="mt-12 p-6 bg-neutral-50 rounded-lg border border-neutral-100">
                <h3 className="font-medium text-neutral-900 mb-2">Looking for Quick Answers?</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Check out our FAQ page for common questions and solutions.
                </p>
                <a href="/faq" className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors uppercase tracking-wider">
                  Visit FAQ →
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card p-8 md:p-12">
                <h2 className="text-2xl font-serif font-medium text-neutral-900 mb-8">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-900 mb-2 uppercase tracking-wider">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-900 mb-2 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2 uppercase tracking-wider">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input"
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2 uppercase tracking-wider">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="input resize-none"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  )
}

