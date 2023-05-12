/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    POLYGON_HOST: "https://api.polygonscan.com/api",
    ETH_HOST: "https://api.etherscan.io/api",
    POLY_BLOCK_URL: "https://polygonscan.com",
    ETH_BLOCK_URL: "https://etherscan.com",
    POLY_API_KEY: "7KEXAHSV3FPNZRFSRG3RFGQD8I6KB45IWJ",
    ETH_API_KEY: "9P7ZFW2G5NPEGRCSIYARBCB5WK86QTCSN2",
  },
};

module.exports = nextConfig;
