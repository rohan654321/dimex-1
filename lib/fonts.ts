import localFont from 'next/font/local';

export const parabolica = localFont({
  src: [
    {
      path: '../public/fonts/parabolica.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/parabolica-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-parabolica',
  display: 'swap',
});