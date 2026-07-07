export type Role = string;

export interface PermissionsMap {
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
  'wholesale.manage_pricing': boolean;
  'staff.manage': boolean;
  'settings.manage': boolean;
  'reports.view_sales': boolean;
  'reports.view_marketing': boolean;
  'media.upload': boolean;
  'audit_log.view': boolean;
}

export type RoleDef = {
  id: string;
  name: string;
  users: number;
  description: string;
  permissions: PermissionsMap;
  isCustom?: boolean;
};

export interface StaffMember {
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: Role | 'super_admin';
  isActive: boolean;
  permissions: PermissionsMap;
  createdAt: number;
  lastLogin?: number;
}

export const defaultStaffPermissions: PermissionsMap = {
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

export const defaultAdminPermissions: PermissionsMap = {
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
