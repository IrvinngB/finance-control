import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/ui/theme-provider"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Header from '@/components/ui/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Control de Finanzas',
  description: 'Aplicación para controlar tus finanzas personales',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {session ? (
            <div className="min-h-screen bg-background">
              <Header />
              <main className="container mx-auto p-4 md:p-8">
                {children}
              </main>
            </div>
          ) : (
            <main className="min-h-screen flex items-center justify-center bg-background">
              {children}
            </main>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}

