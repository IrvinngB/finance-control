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

interface IncomeExpenseChartProps {
  transactions: Transaction[]
}

export default function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
  const monthlyData = transactions.reduce((acc, t) => {
    const date = new Date(t.date)
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
    
    if (!acc[monthYear]) {
      acc[monthYear] = { name: monthYear, ingresos: 0, gastos: 0 }
    }
    
    if (t.type === 'income') {
      acc[monthYear].ingresos += t.amount
    } else {
      acc[monthYear].gastos += t.amount
    }
    
    return acc
  }, {} as Record<string, { name: string; ingresos: number; gastos: number }>)

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

