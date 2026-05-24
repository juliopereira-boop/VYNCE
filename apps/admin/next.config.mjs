/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Internal workspace packages are shipped as TypeScript source and
  // transpiled by Next.js at build time.
  transpilePackages: ['@vynce/ui', '@vynce/validation', '@vynce/database'],
  // Prisma/bcrypt must run on Node, never bundled into the edge/client.
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
};

export default nextConfig;
