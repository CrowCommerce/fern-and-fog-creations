'use server';

import { Resend } from 'resend';
import { contactFormSchema, type ContactFormData } from '@/lib/schemas';
import ContactEmail from '@/emails/contact-email';
import { contactFormRateLimiter, rateLimitByIdentifier } from '@/lib/rate-limit';
import { serverAnalytics } from '@/lib/analytics/server-tracker';

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactFormResult = {
  success: boolean;
  error?: string;
};

export async function submitContactForm(
  data: ContactFormData
): Promise<ContactFormResult> {
  // Validate the data server-side
  const validatedFields = contactFormSchema.safeParse(data);

  if (!validatedFields.success) {
    serverAnalytics.contactFormError({
      error_code: 'VALIDATION_ERROR',
      error_message: 'Please check your form inputs and try again.',
    });
    return {
      success: false,
      error: 'Please check your form inputs and try again.',
    };
  }

  const { name, email, phone, message } = validatedFields.data;

  // Rate limiting by email to prevent spam
  const rateLimitResult = await rateLimitByIdentifier(email, contactFormRateLimiter);

  if (!rateLimitResult.success) {
    serverAnalytics.contactFormError({
      error_code: 'RATE_LIMIT_EXCEEDED',
      error_message: 'Too many requests. Please try again later.',
    });
    return {
      success: false,
      error: 'Too many requests. Please try again later.',
    };
  }

  try {
    console.log('Form Submission Data:', {
      name,
      email,
      phone,
      message,
    });

    // Handle missing API key gracefully (development mode)
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY is missing. Simulating success.');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      serverAnalytics.contactFormSubmitted({ has_phone: !!phone });
      return { success: true };
    }

    const contactEmail = process.env.CONTACT_EMAIL || 'fernandfogcreations@gmail.com';

    // Send branded email via Resend with React Email template
    const emailResult = await resend.emails.send({
      from: 'Fern & Fog Creations <onboarding@resend.dev>',
      to: [contactEmail],
      subject: `New Contact Request from ${name}`,
      react: ContactEmail({
        name,
        email,
        phone,
        message,
      }),
    });

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error);
      serverAnalytics.contactFormError({
        error_code: 'EMAIL_SEND_ERROR',
        error_message: emailResult.error.message,
      });
      return {
        success: false,
        error: emailResult.error.message,
      };
    }

    console.log('Email sent:', emailResult.data);
    serverAnalytics.contactFormSubmitted({ has_phone: !!phone });
    return { success: true };
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    serverAnalytics.contactFormError({
      error_code: 'UNEXPECTED_ERROR',
      error_message: 'Failed to send message. Please try again.',
    });
    return {
      success: false,
      error: 'Failed to send message. Please try again.',
    };
  }
}
