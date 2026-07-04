import './globals.css';

export const metadata = {
  title: 'Goodcents Content Promotional Calendar',
  description: 'Internal marketing calendar and campaign planning tool.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
