'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { ContactPage } from '@/types/contact';
import { submitContactForm } from '@/app/actions/contact';
import type { ContactFormData } from '@/lib/schemas';

interface ContactFormProps {
  content: ContactPage;
}

function FormInput({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-bark mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-mist bg-white px-4 py-3 text-bark placeholder:text-bark/40 focus:border-fern focus:outline-none focus:ring-2 focus:ring-fern/20 transition-colors"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function FormTextarea({
  label,
  name,
  required = false,
  placeholder,
  rows = 5,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-bark mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-mist bg-white px-4 py-3 text-bark placeholder:text-bark/40 focus:border-fern focus:outline-none focus:ring-2 focus:ring-fern/20 transition-colors resize-none"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function ContactFormInner({ content }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isPending, setIsPending] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.message) {
      newErrors.message = 'Please enter a message';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsPending(true);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        toast.success('Message sent!', {
          description: "We'll get back to you as soon as possible.",
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        setErrors({});
      } else {
        toast.error('Failed to send message', {
          description: result.error || 'Please try again.',
        });
      }
    } catch {
      toast.error('Failed to send message', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-bark sm:text-5xl">
              {content.heading}
            </h1>
            <p className="mt-4 text-lg text-bark/70">{content.description}</p>
          </div>

          {/* Optional Contact Info */}
          {(content.emailDisplay || content.phoneDisplay || content.businessHours) && (
            <div className="mb-8 p-6 bg-mist rounded-lg border border-fern/20">
              <h2 className="text-lg font-medium text-bark mb-4">
                Contact Information
              </h2>
              <div className="space-y-3 text-bark/70">
                {content.emailDisplay && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-fern"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a
                      href={`mailto:${content.emailDisplay}`}
                      className="hover:text-fern transition-colors"
                    >
                      {content.emailDisplay}
                    </a>
                  </div>
                )}
                {content.phoneDisplay && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-fern"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a
                      href={`tel:${content.phoneDisplay}`}
                      className="hover:text-fern transition-colors"
                    >
                      {content.phoneDisplay}
                    </a>
                  </div>
                )}
                {content.businessHours && (
                  <div className="flex items-start gap-2 mt-4 pt-4 border-t border-fern/10">
                    <svg
                      className="h-5 w-5 text-fern flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="text-sm whitespace-pre-line">
                      {content.businessHours}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border border-mist p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Name"
                name="name"
                required
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />

              <FormInput
                label="Email"
                name="email"
                type="email"
                required
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <FormInput
                label="Phone"
                name="phone"
                type="tel"
                required
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />

              <FormTextarea
                label="Message"
                name="message"
                required
                placeholder="How can we help you?"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
              />

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-fern px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-moss focus:outline-none focus:ring-2 focus:ring-fern focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Response Time */}
          {content.responseTime && (
            <div className="mt-8 text-center">
              <p className="text-sm text-bark/60">{content.responseTime}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactForm({ content }: ContactFormProps) {
  return <ContactFormInner content={content} />;
}
