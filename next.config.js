/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint:{
      "ignoreDuringBuilds": true
    },
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
            port:'',
            pathname:'/fluency-systems-regular/48/binoculars.png'

          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port:'',
            pathname:'/ios/50/resize-diagonal--v1.png'
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port:'',
            pathname:'/ios/50/compress--v1.png'
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port:'',
            pathname:'/skeuomorphism/32/experimental-checked-skeuomorphism.png'
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/ios-filled/50/FFFFFF/puzzle.png'
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/ios/50/delete-trash.png'
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/external-smashingstocks-detailed-outline-smashing-stocks/66/external-parameters-festivals-and-events-smashingstocks-detailed-outline-smashing-stocks.png'
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/color/48/puzzle.png'
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/emoji/48/cross-mark-emoji.png'
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/fluency/96/user-male-circle--v1.png'
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/windows/32/user-male-circle.png'
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/tiny-color/16/checked.png'
          },
          {
            protocol: 'https',
            hostname: 'img.icons8.com',
            port: '',
            pathname: '/ios-filled/50/plus-math.png'
          }

        ],
      },
      
}

module.exports = nextConfig
