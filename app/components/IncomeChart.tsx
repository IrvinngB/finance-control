'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from "react"

// Define el tipo de los datos de la transacción
type Transaction = {
  created_at: string
  amount: number
  type: 'income' | 'expense'
}

const IncomeChart = () => {
  const [data, setData] = useState<{ name: string, income: number, expenses: number }[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      // Especificar correctamente el tipo de la tabla 'transactions'
      const { data: transactions, error } = await supabase
        .from<Transaction>('transactions') // Especificamos el tipo de datos 'Transaction'
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching data:', error)
        return
      }

      // Procesar los datos para el gráfico
      const processedData = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.created_at)
        const month = date.toLocaleString('default', { month: 'short' })
        
        // Buscar el mes correspondiente en los datos acumulados
        const existingMonth = acc.find(item => item.name === month)
        if (existingMonth) {
          // Si es un ingreso, sumarlo, si es un gasto, restarlo
          if (transaction.type === 'income') {
            existingMonth.income += transaction.amount
          } else {
            existingMonth.expenses += transaction.amount
          }
        } else {
          // Si no existe el mes, agregarlo con los valores iniciales
          acc.push({
            name: month,
            income: transaction.type === 'income' ? transaction.amount : 0,
            expenses: transaction.type === 'expense' ? transaction.amount : 0
          })
        }
        return acc
      }, [])

      // Actualizar el estado con los datos procesados
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
