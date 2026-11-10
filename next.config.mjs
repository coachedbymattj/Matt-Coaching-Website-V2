/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
  async redirects() {
    return [
      // MELT group programme retired; send old links to the apply page.
      { source: "/apply/melt", destination: "/apply", permanent: true },
    ];
  },
};

export default nextConfig;
