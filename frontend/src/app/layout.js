import { Montserrat, Inter } from 'next/font/google'
import './globals.css'
import LayoutContent from './components/LayoutContent'
import { metadata } from './metadata'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export { metadata }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${inter.variable}`}>
        <LayoutContent>
          {children}
        </LayoutContent>
      </body>
    </html>
  );
} 