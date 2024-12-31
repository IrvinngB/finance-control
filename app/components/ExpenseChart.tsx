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

  // Bright, high-contrast colors that work well on dark backgrounds
  const COLORS = [
    '#00ff87', // Bright green
    '#00bfff', // Bright blue
    '#ff3d71', // Bright pink
    '#ffaa00', // Bright orange
    '#bf00ff', // Bright purple
    '#ff3d00', // Bright red
    '#00e5ff', // Cyan
    '#ffff00', // Yellow
  ]

  if (expenseData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Distribución de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No hay datos de gastos disponibles.</p>
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
        <div className="h-[300px] w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={window?.innerWidth < 500 ? 30 : 60}
                outerRadius={window?.innerWidth < 500 ? 60 : 80}
                fill="#8884d8"
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => 
                  window?.innerWidth < 500 ? 
                    `${(percent * 100).toFixed(0)}%` : 
                    `${name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={window?.innerWidth >= 500}
              >
                {expenseData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{ 
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  color: 'var(--foreground)'
                }}
              />
              <Legend
                layout={window?.innerWidth < 500 ? "horizontal" : "vertical"}
                align={window?.innerWidth < 500 ? "center" : "right"}
                verticalAlign={window?.innerWidth < 500 ? "bottom" : "middle"}
                formatter={(value) => (
                  <span style={{ color: 'var(--foreground)' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

