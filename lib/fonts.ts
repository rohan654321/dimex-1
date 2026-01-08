import localFont from 'next/font/local';

export const parabolica = localFont({
  src: [
    {
      path: '../public/fonts/Parabolica-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Parabolica-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Parabolica-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Parabolica-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Parabolica-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-parabolica',
  display: 'swap',
});