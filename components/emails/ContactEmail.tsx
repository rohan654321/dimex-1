import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Row,
  Column,
} from '@react-email/components';

interface ContactEmailProps {
  data: Record<string, any>;
  formType: string;
  submittedAt: string;
}

export default function ContactEmail({ data, formType, submittedAt }: ContactEmailProps) {
  const formatFormType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Html>
      <Head />
      <Preview>New {formatFormType(formType)} Submission</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>New {formatFormType(formType)} Submission</Heading>
            <Text style={subtitle}>Submitted on: {submittedAt}</Text>
          </Section>

          <Section style={content}>
            {Object.entries(data).map(([key, value]) => (
              <Row key={key} style={row}>
                <Column style={labelColumn}>
                  <Text style={label}>
                    {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}:
                  </Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{value || 'Not provided'}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              This email was generated automatically from the {SITE_NAME} website.
            </Text>
            <Text style={footerNote}>
              Please respond to the inquiry within 24 hours.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const header = {
  backgroundColor: '#1e40af',
  color: '#ffffff',
  padding: '20px',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center' as const,
};

const h1 = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
  color: '#ffffff',
};

const subtitle = {
  fontSize: '14px',
  color: '#d1d5db',
  margin: 0,
};

const content = {
  padding: '20px',
};

const row = {
  marginBottom: '15px',
  display: 'flex' as const,
};

const labelColumn = {
  width: '40%',
  paddingRight: '10px',
};

const valueColumn = {
  width: '60%',
};

const label = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#374151',
  margin: 0,
};

const value = {
  fontSize: '14px',
  color: '#6b7280',
  margin: 0,
  padding: '5px 10px',
  backgroundColor: '#f9fafb',
  borderRadius: '4px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footer = {
  padding: '20px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0 0 10px 0',
};

const footerNote = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: 0,
};