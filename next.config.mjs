/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "edamam-product-images.s3.amazonaws.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
