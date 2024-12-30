import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Home, DollarSign, BarChart2, PieChart, LogOut } from 'lucide-react'
import { ThemeProvider } from "@/components/ui/theme-provider"
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'

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
  const supabase = createServerComponentClient({ cookies })
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
          <div className="flex min-h-screen bg-background text-foreground">
            {session && (
              <nav className="w-64 bg-card p-4">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-bold">Control de Finanzas</h1>
                  <ThemeToggle />
                </div>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="flex items-center space-x-2 hover:text-primary transition-colors p-2 rounded-lg">
                      <Home size={20} />
                      <span>Inicio</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/transacciones" className="flex items-center space-x-2 hover:text-primary transition-colors p-2 rounded-lg">
                      <DollarSign size={20} />
                      <span>Transacciones</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/historial" className="flex items-center space-x-2 hover:text-primary transition-colors p-2 rounded-lg">
                      <BarChart2 size={20} />
                      <span>Historial</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/graficas" className="flex items-center space-x-2 hover:text-primary transition-colors p-2 rounded-lg">
                      <PieChart size={20} />
                      <span>Gráficas</span>
                    </Link>
                  </li>
                </ul>
                <div className="mt-auto pt-4">
                  <form action="/auth/signout" method="post">
                    <Button type="submit" variant="ghost" className="w-full flex items-center justify-center gap-2">
                      <LogOut size={20} />
                      <span>Cerrar sesión</span>
                    </Button>
                  </form>
                </div>
              </nav>
            )}
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

