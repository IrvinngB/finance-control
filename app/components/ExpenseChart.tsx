'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface Transaction {
  id: number
  amount: number
  description: string
  type: 'income' | 'expense'
  date: string
}

interface ExpenseChartProps {
  transactions: Transaction[]
}

export default function ExpenseChart({ transactions }: ExpenseChartProps) {
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existingCategory = acc.find(item => item.name === t.description)
      if (existingCategory) {
        existingCategory.value += t.amount
      } else {
        acc.push({ name: t.description, value: t.amount })
      }
      return acc
    }, [] as { name: string; value: number }[])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (expenseData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Distribución de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No hay datos de gastos disponibles.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Distribución de Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${value}`}
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #39FF14' }}
                labelStyle={{ color: '#39FF14' }}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value) => <span style={{ color: '#39FF14' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

