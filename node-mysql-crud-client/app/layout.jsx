import './globals.css'
import Providers from './providers'

// Next.js requires metadata to be exported from a route layout.
// oxlint-disable-next-line react/only-export-components
export const metadata = {
  title: 'Stockroom | Products',
  description: 'A simple dashboard for managing your product inventory.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
