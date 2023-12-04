import Header from '@components/Header'
import Providers from '@lib/Providers'


import "@styles/global.scss"

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learnify Next',
  description: 'Learnify app',
  referrer: 'no-referrer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>

        <Providers>
          <Header />
          <main className="app container">
            {children}
          </main>
        </Providers>
        
      </body>
    </html>
  )
}
