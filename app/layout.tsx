import type { Metadata } from 'next'
import './globals.css'
import 'prismjs/themes/prism-okaidia.css'

export const metadata: Metadata = {
  title: 'CloneGPT'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
