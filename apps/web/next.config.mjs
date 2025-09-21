import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui'],
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@ui'] = path.resolve(
      __dirname,
      '../../packages/ui/src',
    );
    return config;
  },
};

export default nextConfig;
