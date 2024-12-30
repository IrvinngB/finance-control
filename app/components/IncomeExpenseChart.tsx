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
  const monthlyData: MonthlyData[] = []

  transactions.forEach(transaction => {
    const date = new Date(transaction.date)
    const month = date.toLocaleString('default', { month: 'short' })

    // Buscar si ya existe un mes con el nombre correspondiente
    let existingMonth = monthlyData.find(item => item.name === month)

    if (!existingMonth) {
      // Si no existe, crear un nuevo mes
      existingMonth = { name: month, ingresos: 0, gastos: 0 }
      monthlyData.push(existingMonth)
    }

    // Actualizar los valores de ingresos o gastos según el tipo de transacción
    if (transaction.type === 'income') {
      existingMonth.ingresos += transaction.amount
    } else {
      existingMonth.gastos += transaction.amount
    }
  })

  if (monthlyData.length === 0) {
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
          <BarChart data={monthlyData}>
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
