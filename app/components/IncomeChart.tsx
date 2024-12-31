'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'

interface Transaction {
  id: number
  amount: number
  description: string
  type: 'income' | 'expense'
  date: string
}

interface IncomeChartProps {
  transactions: Transaction[]
}

export default function IncomeChart({ transactions }: IncomeChartProps) {
  const monthlyData = transactions.reduce((acc: { name: string; income: number }[], transaction) => {
    if (transaction.type === 'income') {
      const date = new Date(transaction.date)
      const month = date.toLocaleString('default', { month: 'short' })
      
      const existingMonth = acc.find(item => item.name === month)
      if (existingMonth) {
        existingMonth.income += transaction.amount
      } else {
        acc.push({ name: month, income: transaction.amount })
      }
    }
    return acc
  }, [])

  if (monthlyData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ingresos Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No hay datos de ingresos disponibles.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ingresos Mensuales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem'
                }}
              />
              <Bar dataKey="income" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

