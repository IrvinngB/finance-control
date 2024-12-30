'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from "react"

const IncomeChart = () => {
  const [data, setData] = useState([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching data:', error)
        return
      }

      // Procesar los datos para el formato del gráfico
      const processedData = transactions.reduce((acc, transaction) => {
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
    <Chart
      title="Ingresos vs Gastos"
      data={data}
      categories={[
        { name: "income", color: "hsl(var(--primary))" },
        { name: "expenses", color: "hsl(var(--destructive))" }
      ]}
    />
  )
}

export default IncomeChart