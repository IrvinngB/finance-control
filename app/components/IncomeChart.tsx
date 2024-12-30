'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from "react"

interface Transaction {
  created_at: string
  amount: number
  type: 'income' | 'expense'
}

interface MonthlyData {
  name: string
  income: number
  expenses: number
}

const IncomeChart = () => {
  const [data, setData] = useState<MonthlyData[]>([])  // Especificamos el tipo de datos aquí
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: transactions, error } = await supabase
      .from<Transaction, { error: any }>('transactions') // Especificamos el tipo de la tabla y el tipo de error
      .select('*')
      .order('created_at', { ascending: true })


      if (error) {
        console.error('Error fetching data:', error)
        return
      }

      // Procesar los datos para el formato del gráfico
      const processedData = transactions.reduce<MonthlyData[]>((acc, transaction) => {
        const date = new Date(transaction.created_at)
        const month = date.toLocaleString('default', { month: 'short' })

        const existingMonth = acc.find(item => item.name === month)
        if (existingMonth) {
          if (transaction.type === 'income') {
            existingMonth.income += transaction.amount
          } else {
            existingMonth.expenses += transaction.amount
          }
        } else {
          acc.push({
            name: month,
            income: transaction.type === 'income' ? transaction.amount : 0,
            expenses: transaction.type === 'expense' ? transaction.amount : 0
          })
        }
        return acc
      }, [])

      setData(processedData)
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos vs Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart
          title="Ingresos vs Gastos"
          data={data}
          categories={[
            { name: "income", color: "hsl(var(--primary))" },
            { name: "expenses", color: "hsl(var(--destructive))" }
          ]}
        />
      </CardContent>
    </Card>
  )
}

export default IncomeChart
