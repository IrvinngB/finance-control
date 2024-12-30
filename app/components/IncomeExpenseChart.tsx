'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface Transaction {
  id: number
  amount: number
  description: string
  type: 'income' | 'expense'
  date: string
}

interface MonthlyData {
  name: string
  ingresos: number
  gastos: number
}

interface IncomeExpenseChartProps {
  transactions: Transaction[]
}

export default function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
  const monthlyData = transactions.reduce((acc: MonthlyData[], transaction) => {
    const date = new Date(transaction.date)
    const month = date.toLocaleString('default', { month: 'short' })

    // Tipo explícito en find
    const existingMonth = acc.find((item: MonthlyData) => item.name === month)

    if (existingMonth) {
      if (transaction.type === 'income') {
        existingMonth.ingresos += transaction.amount
      } else {
        existingMonth.gastos += transaction.amount
      }
    } else {
      acc.push({
        name: month,
        ingresos: transaction.type === 'income' ? transaction.amount : 0,
        gastos: transaction.type === 'expense' ? transaction.amount : 0
      })
    }

    return acc
  }, [])

  const data = Object.values(monthlyData)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparación de Ingresos y Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No hay datos de ingresos y gastos disponibles.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de Ingresos y Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value}`} />
            <Legend formatter={(value: string) => value.charAt(0).toUpperCase() + value.slice(1)} />
            <Bar dataKey="ingresos" fill="#4caf50" name="Ingresos" />
            <Bar dataKey="gastos" fill="#f44336" name="Gastos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
