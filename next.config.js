/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/ios-glyphs/30/pawn.png'
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '**',
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/ios/50/search--v1.png',
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/ios-filled/100/save--v1.png',
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/material-outlined/96/trash--v2.png',
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/ios-filled/50/FFFFFF/puzzle.png'
          }

        ],
      },
      
}

module.exports = nextConfig
