/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Thumbnails can come from any platform, so allow remote images broadly.
    // For production you may want to narrow this to specific hostnames.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

module.exports = nextConfig;
