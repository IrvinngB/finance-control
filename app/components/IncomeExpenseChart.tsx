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
    const monthYear = window?.innerWidth < 500 ? 
      `${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}` :
      `${date.getMonth() + 1}/${date.getFullYear()}`
    
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
        <div className="h-[300px] w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              margin={window?.innerWidth < 500 ? 
                { top: 20, right: 10, left: -10, bottom: 0 } :
                { top: 20, right: 30, left: 20, bottom: 5 }
              }
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="name"
                fontSize={12}
                tickMargin={8}
                stroke="var(--foreground)"
              />
              <YAxis
                fontSize={12}
                tickMargin={8}
                stroke="var(--foreground)"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem'
                }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Legend
                verticalAlign={window?.innerWidth < 500 ? "top" : "bottom"}
                height={36}
                formatter={(value) => {
                  const formattedValue = value.charAt(0).toUpperCase() + value.slice(1)
                  return <span style={{ color: 'var(--foreground)' }}>{formattedValue}</span>
                }}
              />
              <Bar 
                dataKey="ingresos" 
                fill="var(--primary)" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="gastos" 
                fill="var(--destructive)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

