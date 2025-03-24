/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"], // Permite imagens do GitHub e Google
  },
};

module.exports = nextConfig;

