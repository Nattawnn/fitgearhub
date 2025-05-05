export const metadata = {
  title: 'FitGearHub - Your Fitness Equipment Store',
  description: 'Find the best fitness equipment for your workout needs',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 