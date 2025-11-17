'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import JotformEmbed to avoid SSR issues
const JotformEmbed = dynamic(() => import('react-jotform-embed'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-bark/60">Loading form...</div>
    </div>
  )
})

function ContactFormInner() {
  const formId = process.env.NEXT_PUBLIC_JOTFORM_FORM_ID

  if (!formId) {
    return (
      <div className="bg-parchment min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-display font-bold text-bark sm:text-5xl">
                Get in Touch
              </h1>
              <p className="mt-4 text-lg text-bark/70">
                I&apos;d love to hear from you. Whether you have a question about a piece, want to commission something custom, or just want to say hello.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-6">
              <h2 className="text-lg font-medium text-amber-900 mb-2">
                Contact Form Configuration Required
              </h2>
              <p className="text-sm text-amber-700 mb-4">
                To enable the contact form, please configure the <code className="bg-amber-100 px-1.5 py-0.5 rounded">NEXT_PUBLIC_JOTFORM_FORM_ID</code> environment variable with your Jotform form ID.
              </p>
              <p className="text-sm text-amber-700">
                See the <strong>GO_LIVE.md</strong> documentation for setup instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-bark sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-bark/70">
              I&apos;d love to hear from you. Whether you have a question about a piece, want to commission something custom, or just want to say hello.
            </p>
          </div>

          {/* Jotform Embed */}
          <div className="bg-white rounded-lg shadow-sm border border-mist p-6 sm:p-8">
            <JotformEmbed src={`https://form.jotform.com/${formId}`} />
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-bark/60">
              I typically respond within 1-2 business days. Thank you for your patience!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContactForm() {
  return (
    <Suspense fallback={<div className="bg-parchment min-h-screen" />}>
      <ContactFormInner />
    </Suspense>
  )
}
