// Firestore Collection Names — single source of truth
// Import this anywhere you need collection references

export const COLLECTIONS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  INQUIRIES: 'inquiries',
  STAFF: 'staff',
  AUDIT_LOGS: 'auditLogs',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
} as const;

export const SETTINGS_DOCS = {
  BUSINESS: 'business',   // Admin read/write only — bank details, etc.
  PUBLIC: 'public',       // Public readable — about text, award, theme
} as const;

// ─── ORDER STATUS ─────────────────────────────────────────────
export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Dispatched',
  'Delivered',
  'Cancelled',
  'Returned',
];

// ─── PAYMENT METHOD ───────────────────────────────────────────
export type PaymentMethod = 'COD' | 'BankTransfer';

// ─── INQUIRY TYPE ─────────────────────────────────────────────
export type InquiryType = 'wholesale' | 'general';

// ─── STAFF ROLE ───────────────────────────────────────────────
export type StaffRole = 'admin' | 'staff';

// ─── NOTIFICATION AUDIENCE ────────────────────────────────────
export type NotificationAudience = 'admin' | 'staff' | string; // string = customerId
