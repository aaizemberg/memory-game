/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wttsimfiles.blob.core.windows.net'        
      } //,
      // {
      //   protocol: 'https',
      //   hostname: 'live.staticflickr.com', // Si quiero agregar las fotos de flickr
      // },
    ],
  },
};

export default nextConfig;
