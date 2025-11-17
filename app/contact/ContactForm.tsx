'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import type { ContactPage } from '@/types/contact'

// Dynamically import JotformEmbed to avoid SSR issues
const JotformEmbed = dynamic(() => import('react-jotform-embed'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-bark/60">Loading form...</div>
    </div>
  )
})

interface ContactFormProps {
  content: ContactPage;
}

function ContactFormInner({ content }: ContactFormProps) {
  const formId = process.env.NEXT_PUBLIC_JOTFORM_FORM_ID

  if (!formId) {
    return (
      <div className="bg-parchment min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-display font-bold text-bark sm:text-5xl">
                {content.heading}
              </h1>
              <p className="mt-4 text-lg text-bark/70">
                {content.description}
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
              {content.heading}
            </h1>
            <p className="mt-4 text-lg text-bark/70">
              {content.description}
            </p>
          </div>

          {/* Optional Contact Info */}
          {(content.emailDisplay || content.phoneDisplay || content.businessHours) && (
            <div className="mb-8 p-6 bg-mist rounded-lg border border-fern/20">
              <h2 className="text-lg font-medium text-bark mb-4">Contact Information</h2>
              <div className="space-y-3 text-bark/70">
                {content.emailDisplay && (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-fern" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${content.emailDisplay}`} className="hover:text-fern transition-colors">
                      {content.emailDisplay}
                    </a>
                  </div>
                )}
                {content.phoneDisplay && (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-fern" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${content.phoneDisplay}`} className="hover:text-fern transition-colors">
                      {content.phoneDisplay}
                    </a>
                  </div>
                )}
                {content.businessHours && (
                  <div className="flex items-start gap-2 mt-4 pt-4 border-t border-fern/10">
                    <svg className="h-5 w-5 text-fern flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm whitespace-pre-line">{content.businessHours}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Jotform Embed */}
          <div className="bg-white rounded-lg shadow-sm border border-mist p-6 sm:p-8">
            <JotformEmbed src={`https://form.jotform.com/${formId}`} />
          </div>

          {/* Response Time */}
          {content.responseTime && (
            <div className="mt-8 text-center">
              <p className="text-sm text-bark/60">
                {content.responseTime}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ContactForm({ content }: ContactFormProps) {
  return (
    <Suspense fallback={<div className="bg-parchment min-h-screen" />}>
      <ContactFormInner content={content} />
    </Suspense>
  )
}
