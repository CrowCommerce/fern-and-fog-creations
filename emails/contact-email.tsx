import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Link,
  Button,
  Preview,
} from '@react-email/components';
import type { ContactFormData } from '@/lib/schemas';

interface ContactEmailProps extends ContactFormData {}

export default function ContactEmail({
  name,
  email,
  phone,
  message,
}: ContactEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>New contact request from {name}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.companyName}>Fern & Fog Creations</Heading>
            <Text style={styles.headerSubtext}>New Contact Request</Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            {/* Contact Information Card */}
            <Section style={styles.card}>
              <Text style={styles.cardTitle}>Contact Information</Text>

              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{name}</Text>

              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>
                <Link href={`tel:${phone}`} style={styles.link}>
                  {phone}
                </Link>
              </Text>

              <Text style={styles.label}>Email</Text>
              <Text style={{ ...styles.value, marginBottom: 0 }}>
                <Link href={`mailto:${email}`} style={styles.link}>
                  {email}
                </Link>
              </Text>
            </Section>

            {/* Message Card */}
            <Section style={styles.card}>
              <Text style={styles.cardTitle}>Message</Text>
              <Section style={styles.messageBox}>
                <Text style={styles.messageText}>
                  {message || 'No message provided.'}
                </Text>
              </Section>
            </Section>

            {/* CTA Button */}
            <Section style={styles.buttonContainer}>
              <Button href={`mailto:${email}`} style={styles.ctaButton}>
                Reply to Customer
              </Button>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerCompany}>Fern & Fog Creations</Text>
            <Text style={styles.footerTagline}>Handmade Coastal Crafts</Text>
            <Text style={styles.footerCopyright}>
              &copy; {new Date().getFullYear()} Fern & Fog Creations
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Fern & Fog brand colors from globals.css
const brandColors = {
  moss: '#33593D', // dark green
  fern: '#4F7942', // medium green - primary
  parchment: '#F5F0E6', // cream - background
  bark: '#5B4636', // brown - text
  mist: '#E6ECE8', // light - cards
  gold: '#C5A05A', // gold - highlights
  white: '#ffffff',
};

const styles = {
  body: {
    backgroundColor: brandColors.parchment,
    fontFamily: 'Georgia, serif',
    padding: '40px 0',
    margin: 0,
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '0 20px',
  },
  header: {
    padding: '0 0 32px 0',
    textAlign: 'center' as const,
  },
  companyName: {
    color: brandColors.bark,
    fontSize: '32px',
    fontWeight: '600',
    fontFamily: 'Georgia, serif',
    margin: '0 0 8px 0',
    lineHeight: '1.2',
  },
  headerSubtext: {
    color: brandColors.fern,
    fontSize: '16px',
    margin: '0',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: '500',
  },
  content: {
    padding: '0',
  },
  card: {
    backgroundColor: brandColors.white,
    borderRadius: '16px',
    padding: '28px',
    marginBottom: '20px',
    border: `1px solid ${brandColors.mist}`,
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  },
  cardTitle: {
    color: brandColors.bark,
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginTop: '0',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: `2px solid ${brandColors.fern}`,
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  label: {
    color: brandColors.moss,
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0 0 4px 0',
    fontWeight: 'bold',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  value: {
    color: brandColors.bark,
    fontSize: '18px',
    fontWeight: '400',
    margin: '0 0 20px 0',
    fontFamily: 'Georgia, serif',
  },
  link: {
    color: brandColors.fern,
    textDecoration: 'underline',
    fontWeight: '500',
  },
  messageBox: {
    backgroundColor: brandColors.mist,
    padding: '20px',
    borderRadius: '12px',
    border: `1px solid rgba(79, 121, 66, 0.2)`,
  },
  messageText: {
    color: brandColors.bark,
    fontSize: '16px',
    lineHeight: '1.7',
    margin: '0',
    whiteSpace: 'pre-wrap' as const,
    fontFamily: 'Georgia, serif',
  },
  buttonContainer: {
    textAlign: 'center' as const,
    marginTop: '8px',
    marginBottom: '32px',
  },
  ctaButton: {
    backgroundColor: brandColors.gold,
    color: brandColors.bark,
    padding: '14px 36px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 4px 8px rgba(197, 160, 90, 0.3)',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  footer: {
    padding: '24px 0',
    textAlign: 'center' as const,
    borderTop: `1px solid rgba(91, 70, 54, 0.15)`,
    marginTop: '16px',
  },
  footerCompany: {
    color: brandColors.bark,
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    fontFamily: 'Georgia, serif',
  },
  footerTagline: {
    color: brandColors.fern,
    fontSize: '14px',
    margin: '0 0 16px 0',
    fontStyle: 'italic',
    fontFamily: 'Georgia, serif',
  },
  footerCopyright: {
    color: 'rgba(91, 70, 54, 0.5)',
    fontSize: '12px',
    margin: '0',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
};
