'use client'

import { useState, useEffect, Suspense, Fragment } from 'react'
import { useSearchParams } from 'next/navigation'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { classNames } from '@/lib/utils'

const productInterests = [
  'General Inquiry',
  'Earrings',
  'Resin Art',
  'Driftwood Pieces',
  'Wall Hangings',
  'Custom Request',
]

function ContactForm() {
  const searchParams = useSearchParams()
  const productParam = searchParams?.get('product')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    productInterest: '',
    message: '',
    honeypot: '', // Anti-spam field
  })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (productParam) {
      setFormData(prev => ({ ...prev, productInterest: 'Custom Request', message: `I'm interested in: ${productParam}` }))
    }
  }, [productParam])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (formData.honeypot) {
      return // Bot detected
    }

    if (!validate()) {
      return
    }

    // Simulate submission (replace with actual API call)
    console.log('Form submitted:', formData)
    setStatus('success')
    setFormData({ name: '', email: '', productInterest: '', message: '', honeypot: '' })

    setTimeout(() => {
      setStatus('idle')
    }, 5000)
  }

  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-bark sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-bark/70">
              I&apos;d love to hear from you. Whether you have a question about a piece, want to commission something custom, or just want to say hello.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-bark mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 bg-white border rounded-md text-bark placeholder-bark/40 focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-bark/20 focus:ring-fern'
                }`}
                placeholder="Your name"
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-bark mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 bg-white border rounded-md text-bark placeholder-bark/40 focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-bark/20 focus:ring-fern'
                }`}
                placeholder="your@email.com"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Product Interest */}
            <div>
              <label htmlFor="productInterest" className="block text-sm font-medium text-bark mb-2">
                What are you interested in?
              </label>
              <Listbox
                value={formData.productInterest}
                onChange={(value) => setFormData({ ...formData, productInterest: value })}
              >
                <Fragment>
                    <ListboxButton
                      id="productInterest"
                      aria-label="What are you interested in?"
                      className="w-full inline-flex items-center justify-between gap-2 rounded-md border border-mist bg-parchment px-4 py-3 text-sm text-bark shadow-sm transition-colors hover:bg-mist focus:outline-none focus:ring-2 focus:ring-fern"
                    >
                      <span className={classNames('truncate capitalize', !formData.productInterest && 'text-bark/60')}>
                        {formData.productInterest || 'Select an option'}
                      </span>
                      <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-bark/50 flex-shrink-0" />
                    </ListboxButton>

                    <ListboxOptions
                      anchor="bottom start"
                      className="mt-2 w-[var(--button-width)] rounded-md border border-mist bg-parchment p-1 shadow-lg ring-1 ring-bark/10 focus:outline-none z-10"
                    >
                      {productInterests.map((interest) => {
                        const isSelected = formData.productInterest === interest

                        return (
                          <ListboxOption
                            key={interest}
                            value={interest}
                            className={({ focus }) =>
                              classNames(
                                'group flex cursor-pointer items-center justify-between rounded-[6px] px-3 py-2 text-sm',
                                focus && 'bg-mist',
                                isSelected ? 'text-fern' : 'text-bark'
                              )
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span className={classNames('truncate capitalize', selected && 'font-medium')}>
                                  {interest}
                                </span>
                                {selected && (
                                  <CheckIcon aria-hidden="true" className="ml-3 h-4 w-4 text-fern flex-shrink-0" />
                                )}
                              </>
                            )}
                          </ListboxOption>
                        )
                      })}
                    </ListboxOptions>
                </Fragment>
              </Listbox>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-bark mb-2">
                Message *
              </label>
              <textarea
                id="message"
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`w-full px-4 py-3 bg-white border rounded-md text-bark placeholder-bark/40 focus:outline-none focus:ring-2 resize-none ${
                  errors.message ? 'border-red-500 focus:ring-red-500' : 'border-bark/20 focus:ring-fern'
                }`}
                placeholder="Tell me about your vision or question..."
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-fern text-parchment font-medium rounded-md hover:bg-moss transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={status === 'success'}
              >
                {status === 'success' ? 'Message Sent!' : 'Send Message'}
              </button>
            </div>

            {/* Success Message */}
            {status === 'success' && (
              <div
                className="p-4 bg-fern/10 border border-fern rounded-md text-sm text-fern"
                role="status"
                aria-live="polite"
              >
                Thank you for reaching out! I&apos;ll get back to you as soon as possible, usually within 1-2 business days.
              </div>
            )}

            {/* Note */}
            <p className="text-sm text-bark/60 text-center">
              * Required fields • For demo purposes, this form logs to console only
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="bg-parchment min-h-screen" />}>
      <ContactForm />
    </Suspense>
  )
}

