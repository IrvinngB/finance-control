'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, Home, DollarSign, BarChart2, PieChart, LogOut } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { Button } from '@/components/ui/button'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { href: '/', text: 'Inicio', icon: Home },
    { href: '/transacciones', text: 'Transacciones', icon: DollarSign },
    { href: '/historial', text: 'Historial', icon: BarChart2 },
    { href: '/graficas', text: 'Gráficas', icon: PieChart },
  ]

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="text-2xl font-bold text-primary">
              Control de Finanzas
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md"
                  >
                    <Icon size={20} />
                    <span>{item.text}</span>
                  </Link>
                </motion.div>
              )
            })}
            <ThemeToggle />
            <form action="/auth/signout" method="post">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden py-4"
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors px-3 py-3"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.text}</span>
                </Link>
              )
            })}
            <form action="/auth/signout" method="post" className="px-3 py-3">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsOpen(false)}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Cerrar sesión</span>
              </Button>
            </form>
          </motion.div>
        )}
      </nav>
    </header>
  )
}

export default Header

