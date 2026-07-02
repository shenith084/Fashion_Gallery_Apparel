// =====================================================
// FIRESTORE DOCUMENT TYPE DEFINITIONS
// Fashion Gallery Apparel — My Moon Clothing
// =====================================================
import type { Timestamp } from 'firebase/firestore';
import type { OrderStatus, PaymentMethod, InquiryType, StaffRole } from './constants';

// ─── SHARED ───────────────────────────────────────────────────
export interface CloudinaryImage {
  cloudinaryPublicId: string;
  secureUrl: string;
  alt: string;
}

// ─── PRODUCT ──────────────────────────────────────────────────
export interface ProductVariant {
  size: string;        // e.g. "M", "L", "XL", "2XL", "3XL"
  color: string;       // e.g. "Burgundy", "Black", "Pink"
  stock: number;
  priceOverride?: number;  // if different from basePrice
}

export interface Product {
  id?: string;
  name: string;
  slug: string;        // URL-friendly: "burgundy-wrap-midi-dress"
  categoryId: string;
  description: string;
  images: CloudinaryImage[];
  fabric: string;      // e.g. "Cotton", "Linen", "Satin"
  modelSize: string;   // e.g. "Uk 10 (M)"
  variants: ProductVariant[];
  basePrice: number;   // in LKR
  status: 'active' | 'hidden';
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Private subcollection — Admin only
export interface ProductFinancials {
  costPrice: number;
  profitMargin: number;  // percentage
}

// ─── CATEGORY ─────────────────────────────────────────────────
export interface Category {
  id?: string;
  name: string;
  slug: string;
  parentCategory?: string | null;
  order: number;        // display order
  image?: CloudinaryImage;
  createdAt: Timestamp;
}

// ─── ORDER ────────────────────────────────────────────────────
export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  color: string;
  qty: number;
  price: number;        // price at time of order
  imageUrl?: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  city: string;
  email?: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Timestamp;
  byStaffId?: string;
  note?: string;
}

export interface Order {
  id?: string;
  orderNumber: string;   // e.g. "FGA-1042"
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentProofUrl?: string;    // Cloudinary secure URL (Bank Transfer only)
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  notes?: string;              // internal staff notes
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── CUSTOMER ─────────────────────────────────────────────────
export interface Customer {
  id?: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  email?: string;
  orderRefs: string[];     // array of order IDs
  totalSpent: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── INQUIRY ──────────────────────────────────────────────────
export interface Inquiry {
  id?: string;
  type: InquiryType;
  name: string;
  phone: string;
  email?: string;
  businessName?: string;   // wholesale
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: Timestamp;
}

// ─── STAFF ────────────────────────────────────────────────────
export interface StaffPermissions {
  'product.view': boolean;
  'product.edit_details': boolean;
  'product.edit_price': boolean;
  'product.edit_stock': boolean;
  'product.delete': boolean;
  'order.view': boolean;
  'order.view_financials': boolean;
  'order.update_status': boolean;
  'order.cancel': boolean;
  'customer.view': boolean;
  'wholesale.view': boolean;
  'wholesale.manage_pricing': boolean;   // hard-locked to Admin
  'staff.manage': boolean;               // hard-locked to Admin
  'settings.manage': boolean;            // hard-locked to Admin
  'reports.view_sales': boolean;
  'reports.view_marketing': boolean;     // hard-locked to Admin
  'media.upload': boolean;
  'audit_log.view': boolean;             // hard-locked to Admin
}

export interface StaffMember {
  id?: string;
  name: string;
  email: string;
  role: StaffRole;
  permissions: StaffPermissions;
  active: boolean;
  lastLogin?: Timestamp;
  createdBy: string;      // staff ID of admin who created this account
  createdAt: Timestamp;
}

// Default permissions for a new Staff member
export const DEFAULT_STAFF_PERMISSIONS: StaffPermissions = {
  'product.view': true,
  'product.edit_details': false,
  'product.edit_price': false,
  'product.edit_stock': true,
  'product.delete': false,
  'order.view': true,
  'order.view_financials': false,
  'order.update_status': true,
  'order.cancel': false,
  'customer.view': true,
  'wholesale.view': true,
  'wholesale.manage_pricing': false,
  'staff.manage': false,
  'settings.manage': false,
  'reports.view_sales': false,
  'reports.view_marketing': false,
  'media.upload': true,
  'audit_log.view': false,
};

// Admin always has full permissions
export const ADMIN_PERMISSIONS: StaffPermissions = {
  'product.view': true,
  'product.edit_details': true,
  'product.edit_price': true,
  'product.edit_stock': true,
  'product.delete': true,
  'order.view': true,
  'order.view_financials': true,
  'order.update_status': true,
  'order.cancel': true,
  'customer.view': true,
  'wholesale.view': true,
  'wholesale.manage_pricing': true,
  'staff.manage': true,
  'settings.manage': true,
  'reports.view_sales': true,
  'reports.view_marketing': true,
  'media.upload': true,
  'audit_log.view': true,
};

// ─── AUDIT LOG ────────────────────────────────────────────────
export interface AuditLog {
  id?: string;
  actorId: string;
  actorName: string;
  actorRole: StaffRole;
  action: string;          // e.g. "order.status_updated", "staff.permission_changed"
  targetType: string;      // e.g. "order", "product", "staff"
  targetId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  timestamp: Timestamp;
}

// ─── NOTIFICATION ─────────────────────────────────────────────
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface Notification {
  id?: string;
  audience: string;      // 'admin' | 'staff' | customerId
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;         // route to navigate to on click
  createdAt: Timestamp;
}

// ─── SETTINGS ─────────────────────────────────────────────────
export interface BusinessSettings {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  bankBranch: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  updatedAt: Timestamp;
}

export interface PublicSettings {
  aboutText: string;
  awardYear: string;         // e.g. "2024"
  followerCount: string;     // e.g. "9.4K+"
  deliveryFee: number;       // in LKR
  freeDeliveryThreshold?: number;
  whatsappNumber: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  updatedAt: Timestamp;
}
