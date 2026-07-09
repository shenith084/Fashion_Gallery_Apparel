# Fashion Gallery Apparel (My Moon Clothing)

A production-grade, secure, mobile-first fashion e-commerce platform built for Fashion Gallery Apparel (Moratuwa, Sri Lanka).

## 🌟 Key Features

*   **Public Storefront**: Elegant, mobile-first shopping experience with category filtering, guest checkout, and responsive design.
*   **Wholesale (B2B) Portal**: Dedicated wholesale application system with real-time admin review and custom B2B pricing capabilities.
*   **Unified Admin Panel**: A single, role-based dashboard (`/admin`) shared by the Admin (Owner) and Staff. Features adapt in real-time based on the user's permissions.
*   **Activity Logging**: Comprehensive, secure audit logging of all staff actions (e.g., status changes, stock updates) with device and timestamp tracking.
*   **Real-Time Capabilities**: Live order feed, instant stock updates, and live permission changes (no logout required).
*   **Global Notification System**: Shared toast/popup engine for both customers (e.g., cart additions, low stock) and admins (new orders, wholesale alerts, unread messages).
*   **Performance Optimized**: Utilizes intelligent Firestore parallel querying, `Suspense` boundaries, and highly-polished Skeleton loaders for perceived instant-load times.
*   **Media Pipeline**: Powered by Cloudinary for automatic image optimization, responsive delivery, and signed secure uploads.

## 🏗️ Architecture overview

This project uses a **Modular Monolith** architecture:
*   **Framework**: Next.js 14 (App Router) handling both frontend and server-side logic (Server Actions / API Routes).
*   **Database & Auth**: Firebase Firestore (data) and Firebase Auth (identity & custom claims).
*   **Media**: Cloudinary for all product photography and assets.
*   **Styling**: Pure CSS Modules with a strict, premium design system (Deep Burgundy, Rose Gold, Warm Ivory).

## 🚀 Getting Started

### Prerequisites
*   Node.js 18.x or later
*   A Firebase Project
*   A Cloudinary Account

### Installation

1.  Clone the repository and install dependencies in the web workspace:
    ```bash
    cd fashion-gallery-web
    npm install
    ```
2.  Copy `.env.example` to `.env.local` and fill in your Firebase and Cloudinary credentials.
    ```bash
    cp .env.example .env.local
    ```
3.  Run the seed script to initialize the database (Categories, Settings, Sample Products):
    ```bash
    npm run db:seed
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## 📚 Documentation
*   [Admin Panel User Guide](./ADMIN_GUIDE.md) - For Owners and Staff
*   [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Instructions for deploying to Vercel
