'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

interface Transaction {
  id: number;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  date: string;
}

interface ChartData {
  name: string;
  income: number;
}

interface IncomeChartProps {
  transactions: Transaction[];
}

export default function IncomeChart({ transactions }: IncomeChartProps) {
  const data: ChartData[] = transactions.reduce((acc: ChartData[], transaction) => {
    if (transaction.type === 'income') {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'short' });
      
      const existingMonth = acc.find(item => item.name === month);
      if (existingMonth) {
        existingMonth.income += transaction.amount;
      } else {
        acc.push({ name: month, income: transaction.amount });
      }
    }
    return acc;
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ingresos Mensuales</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            income: {
              label: "Ingresos",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="income" fill="var(--color-income)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

