# Deployment Guide
*Fashion Gallery Apparel (My Moon Clothing)*

This project is optimized for deployment on **Vercel** as a unified Next.js Application.

## 🚀 Step 1: Preparation

1.  **Firebase Production Project**
    *   Create a new Firebase Project for production.
    *   Enable **Firestore Database**.
    *   Enable **Authentication** (Email/Password).
    *   Add a Web App to get your Firebase configuration.
    *   Generate a new Admin SDK Private Key for the server.

2.  **Cloudinary Production Environment**
    *   Create a separate Cloudinary cloud for production to avoid mixing test images with live images.
    *   Set up your folders (`fashion-gallery/maxi-dresses/`, etc.).

3.  **Resend (Email)**
    *   Verify your production domain in Resend to ensure emails land in the inbox.

## 🚀 Step 2: Vercel Deployment

1.  Push your code to a GitHub repository (`main` branch).
2.  Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3.  Import the GitHub repository.
4.  **Framework Preset**: Next.js (should be auto-detected).
5.  **Environment Variables**: You MUST add all variables from `.env.example` into the Vercel dashboard.
    *   Make sure to format `FIREBASE_ADMIN_PRIVATE_KEY` correctly. Sometimes Vercel requires quotes or proper handling of `\n` characters for multi-line private keys.
6.  Click **Deploy**.

## 🚀 Step 3: Post-Deployment

1.  **Seed the Database**:
    *   Do NOT run the seed script blindly against production if it has live data. 
    *   If this is a fresh database, run the seed script locally pointing to the production Firebase instance by temporarily swapping your `.env.local` variables and running `npm run db:seed`.
2.  **Create Admin User**:
    *   Go to your Firebase Console -> Authentication.
    *   Manually add the owner's email and password.
    *   Manually add the `role: "admin"` custom claim (this can be done via an admin script or the Firebase console if you have an extension).
3.  **Test the flow**:
    *   Place a test order on the live site.
    *   Log into `/admin` and confirm the order.

## 🔄 CI/CD & Backups
*   **Automatic Deployments**: Any push to the `main` branch on GitHub will automatically trigger a Vercel deployment.
*   **Backups**: Set up Google Cloud Platform scheduled exports for Firestore to ensure order and customer data is backed up daily.
