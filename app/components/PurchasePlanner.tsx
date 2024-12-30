'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function PurchasePlanner() {
  const [itemName, setItemName] = useState('')
  const [cost, setCost] = useState('')
  const [date, setDate] = useState<Date>()
  const [savings, setSavings] = useState(1500) // Ejemplo de ahorros actuales
  const [monthlyIncome] = useState(4000) // Ejemplo de ingreso mensual
  const [monthlyExpenses] = useState(3000) // Ejemplo de gastos mensuales

  const calculatePurchasePlan = () => {
    if (!date || !cost) return null

    const monthsUntilPurchase = Math.ceil(
      (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
    )
    
    const monthlySavings = monthlyIncome - monthlyExpenses
    const totalNeeded = parseFloat(cost)
    const currentSavings = savings
    
    if (currentSavings >= totalNeeded) {
      return {
        canBuyNow: true,
        message: "¡Puedes realizar la compra ahora mismo!",
        remainingSavings: currentSavings - totalNeeded
      }
    }

    const additionalSavingsNeeded = totalNeeded - currentSavings
    const monthlySavingsNeeded = additionalSavingsNeeded / monthsUntilPurchase

    if (monthlySavingsNeeded > monthlySavings) {
      const possibleMonths = Math.ceil(additionalSavingsNeeded / monthlySavings)
      return {
        canBuyNow: false,
        message: `Necesitarás ahorrar durante ${possibleMonths} meses para realizar esta compra`,
        monthlySavings: monthlySavings
      }
    }

    return {
      canBuyNow: false,
      message: `Necesitas ahorrar $${monthlySavingsNeeded.toFixed(2)} mensualmente para alcanzar tu objetivo`,
      monthlySavings: monthlySavingsNeeded
    }
  }

  const purchasePlan = calculatePurchasePlan()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Planificador de Compras</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Artículo
            </label>
            <Input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Nombre del artículo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Costo
            </label>
            <Input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Costo del artículo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Fecha Objetivo
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {purchasePlan && (
            <div className="mt-4 p-4 rounded-lg bg-gray-900">
              <h3 className="text-lg font-semibold text-neon-green mb-2">
                Plan de Compra
              </h3>
              <p className="text-gray-300">{purchasePlan.message}</p>
              {purchasePlan.canBuyNow && (
                <p className="mt-2 text-gray-400">
                  Te quedarían ${purchasePlan.remainingSavings.toFixed(2)} en ahorros
                </p>
              )}
              {!purchasePlan.canBuyNow && (
                <div className="mt-2">
                  <p className="text-gray-400">
                    Ahorro mensual sugerido: ${purchasePlan.monthlySavings.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

