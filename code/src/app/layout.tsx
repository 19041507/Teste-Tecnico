import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import '@/styles/globals.css'
import { Toaster } from '@/shared/ui/sonner'

const geist = Geist({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Motiron',
  description: 'Plataforma de gestão de frotas',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={geist.className} suppressHydrationWarning>
        {children}
        <Toaster richColors expand={true} theme="light" />
      </body>
    </html>
  )
}
