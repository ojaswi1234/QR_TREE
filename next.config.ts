import type { NextConfig } from "next";
// @ts-ignore - Type incompatibility between next-pwa and Next.js 16
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  turbopack: {},
};

// @ts-ignore
const configWithPWA = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
// @ts-ignore
})(nextConfig as any);

export default configWithPWA;
