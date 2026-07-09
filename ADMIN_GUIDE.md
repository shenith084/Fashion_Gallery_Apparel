# Admin Panel User Guide
*Fashion Gallery Apparel (My Moon Clothing)*

This guide explains how to use the single, unified Admin Panel (`/admin`) for the storefront.

## 🧑‍💼 Roles Overview

The system has two roles:
1.  **Admin (Owner)**: Has full access to all modules, including Staff Management, Settings, Audit Logs, and Financial/Cost data.
2.  **Staff**: Has restricted access. A staff member only sees the modules and actions they have been explicitly granted permission for by the Admin.

---

## 🛠️ Admin-Only Capabilities (Owner)

### Staff Management & Permissions
As an Admin, you can add new staff accounts and control their permissions in real-time.
*   **Where to find it**: Click **Staff** in the sidebar.
*   **Permissions**: You can toggle permissions like `product.edit_price`, `order.cancel`, or `media.upload`.
*   **Real-time updates**: If you change a staff member's permissions while they are logged in, their interface will update instantly without requiring them to log out.

### Settings & Business Details
*   **Where to find it**: Click **Settings** in the sidebar.
*   **What it does**: Manage Bank Account details for Bank Transfers, update business information (phone, social links), and manage Cloudinary configuration.

### Activity Logs
*   **Where to find it**: Click **Activity Logs** in the sidebar.
*   **What it does**: Monitor detailed, real-time records of all staff actions across the system. See exactly who performed an action (e.g., updating a wholesale application status), what time it happened, and what device they used.
*   **KPI Tracking**: Includes a dashboard for tracking today's activities, active staff count, and critical actions.

### Wholesale Management (`wholesale.view`)
*   **Where to find it**: Click **Wholesale** in the sidebar.
*   **What it does**: Review and process incoming B2B wholesale applications. 
*   **Notifications**: The sidebar badge instantly updates when new applications are submitted. Clicking "View Details" on an application marks it as read.

### Messages & Inquiries
*   **Where to find it**: Click the **Messages** icon in the top right of the navigation bar.
*   **What it does**: Read and respond to customer inquiries submitted through the contact forms.
*   **Notifications**: A red notification dot will appear if there are unread messages, and disappear once they are opened.

---

## 📝 Staff Quick-Reference (Daily Operations)

*Note: You will only see the features below if the Admin has granted you permission.*

### 1. Order Management (`order.update_status`)
1.  Navigate to **Orders** in the sidebar.
2.  **New Orders**: Check the live order feed for new purchases.
3.  **Confirming Orders**: For COD, call the customer to confirm, then change status to **Confirmed**.
4.  **Bank Transfers**: Check if the customer has uploaded a payment proof. If valid, mark the order as **Confirmed**.
5.  **Fulfillment**: Update statuses to **Processing** → **Dispatched** → **Delivered**. 

### 2. Product & Stock Management (`product.edit_stock`)
1.  Navigate to **Products** in the sidebar.
2.  **Updating Stock**: Find the product, click **Edit**, and adjust the stock counters for the respective sizes/colors. Click Save.
3.  *Note: Depending on your permissions, you may or may not be able to edit product prices or delete products.*

### 3. Media & Uploads (`media.upload`)
*   If you have permission, you can upload new product photos directly via the **Media Manager**. The system automatically optimizes and resizes them for the website.

### 4. Notifications
*   Pay attention to popup notifications in the corner of your screen! You will be alerted instantly when stock runs low or a new order arrives.
