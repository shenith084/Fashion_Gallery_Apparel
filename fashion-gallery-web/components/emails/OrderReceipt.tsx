import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface OrderReceiptProps {
  customerName: string;
  orderId: string;
  items: any[];
  total: string;
  address: string;
}

export const OrderReceipt = ({
  customerName,
  orderId,
  items,
  total,
  address,
}: OrderReceiptProps) => (
  <Html>
    <Head />
    <Preview>Your Fashion Gallery Apparel Order Receipt</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={headerTitle}>Fashion Gallery Apparel</Heading>
        </Section>
        
        <Section style={content}>
          <Text style={greeting}>Hi {customerName},</Text>
          <Text style={text}>
            Thank you for your order! We have received it and are currently processing it.
            Your order ID is <strong>{orderId}</strong>.
          </Text>

          <Heading style={sectionTitle}>Order Summary</Heading>
          <Hr style={hr} />
          
          {items.map((item, index) => (
            <Section key={index} style={itemRow}>
              <Text style={itemName}>
                {item.qty}x {item.product?.name || 'Product'} 
                {item.size || item.color ? ` (${item.color || ''} ${item.size || ''})` : ''}
              </Text>
              <Text style={itemPrice}>
                LKR {(item.product?.price * item.qty).toLocaleString('en-LK')}
              </Text>
            </Section>
          ))}
          
          <Hr style={hr} />
          <Section style={itemRow}>
            <Text style={totalLabel}>Total</Text>
            <Text style={totalValue}>{total}</Text>
          </Section>

          <Heading style={sectionTitle}>Delivery Details</Heading>
          <Text style={text}>{address}</Text>

          <Text style={footerText}>
            If you have any questions, simply reply to this email or contact us on WhatsApp.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '32px 20px',
  backgroundColor: '#6B2335', // Burgundy
  textAlign: 'center' as const,
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const content = {
  padding: '24px 32px',
};

const greeting = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
};

const sectionTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
  marginTop: '32px',
  marginBottom: '16px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '12px 0',
};

const itemName = {
  color: '#4b5563',
  fontSize: '16px',
  margin: '0',
};

const itemPrice = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
};

const totalLabel = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
};

const totalValue = {
  color: '#6B2335',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  marginTop: '48px',
};
