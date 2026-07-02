import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Configuration
// This should ONLY be used in server-side code (Server Actions, Route Handlers)
// Never import this file directly into a client component.

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
