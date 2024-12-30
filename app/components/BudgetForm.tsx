'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function BudgetForm() {
  const [budget, setBudget] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para establecer el presupuesto
    console.log({ budget })
    setBudget('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Establecer Presupuesto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-400">Presupuesto Mensual</label>
            <Input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" className="w-full">Establecer Presupuesto</Button>
        </form>
      </CardContent>
    </Card>
  )
}

