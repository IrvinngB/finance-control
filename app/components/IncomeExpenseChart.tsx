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

    const existingMonth = acc.find((item: MonthlyData) => item.name === month) // Tipo explícito para item

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
      <Card className="w-full">
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Comparación de Ingresos y Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="name"
                stroke="#39FF14"
              />
              <YAxis
                stroke="#39FF14"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #39FF14',
                  color: '#39FF14'
                }}
                formatter={(value) => `$${value}`}
              />
              <Legend
                formatter={(value) => {
                  const formattedValue = value.charAt(0).toUpperCase() + value.slice(1)
                  return <span style={{ color: '#39FF14' }}>{formattedValue}</span>
                }}
              />
              <Bar dataKey="ingresos" fill="#39FF14" />
              <Bar dataKey="gastos" fill="#FF3939" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
