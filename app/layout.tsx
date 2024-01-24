import Header from '@components/Header'
import Providers from '@lib/Providers'
import { ToastContainer } from 'react-toastify'

import "@styles/global.scss"
import 'react-toastify/dist/ReactToastify.min.css';

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learnify',
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

            <ToastContainer 
              position="top-right"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />

          </main>
        </Providers>
        
      </body>
    </html>
  )
}
