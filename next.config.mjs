//next.config.mjs
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: [
//       "picsum.photos",
//       "images.unsplash.com",
//       "res.cloudinary.com",
//       "your-cdn.com" // add your actual CDN/domain here
//     ],
//   },
// };

// export default nextConfig;


// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/**",
      },
      // Add more if needed
      // { protocol: "https", hostname: "your-cdn.com" },
    ],
  },
};

export default nextConfig;