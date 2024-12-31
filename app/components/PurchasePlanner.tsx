'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from '@/components/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"

interface PurchasePlan {
  canBuyNow: boolean
  message: string
  monthlySavings?: number
  remainingSavings?: number
}

export default function PurchasePlanner() {
  const [itemName, setItemName] = useState('')
  const [cost, setCost] = useState('')
  const [date, setDate] = useState<Date | undefined>()
  const [savings] = useState(1500) // Ejemplo de ahorros actuales
  const [monthlyIncome] = useState(4000) // Ejemplo de ingreso mensual
  const [monthlyExpenses] = useState(3000) // Ejemplo de gastos mensuales
  const [plan, setPlan] = useState<PurchasePlan | null>(null)

  const calculatePurchasePlan = () => {
    if (!date || !cost || !itemName) {
      return
    }

    const totalNeeded = parseFloat(cost)
    if (isNaN(totalNeeded)) {
      return
    }

    const monthsUntilPurchase = Math.ceil(
      (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
    )
    
    const monthlySavings = monthlyIncome - monthlyExpenses
    const currentSavings = savings
    
    if (currentSavings >= totalNeeded) {
      setPlan({
        canBuyNow: true,
        message: "¡Puedes realizar la compra ahora mismo!",
        remainingSavings: currentSavings - totalNeeded
      })
      return
    }

    const additionalSavingsNeeded = totalNeeded - currentSavings
    const monthlySavingsNeeded = additionalSavingsNeeded / monthsUntilPurchase

    if (monthlySavingsNeeded > monthlySavings) {
      const possibleMonths = Math.ceil(additionalSavingsNeeded / monthlySavings)
      setPlan({
        canBuyNow: false,
        message: `Necesitarás ahorrar durante ${possibleMonths} meses para realizar esta compra`,
        monthlySavings: monthlySavings
      })
      return
    }

    setPlan({
      canBuyNow: false,
      message: `Necesitas ahorrar $${monthlySavingsNeeded.toFixed(2)} mensualmente para alcanzar tu objetivo`,
      monthlySavings: monthlySavingsNeeded
    })
  }

  const isDateDisabled = (date: Date) => {
    return date < new Date()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Planificador de Compras</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
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
            <label className="block text-sm font-medium text-muted-foreground mb-1">
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
            <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                  {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={isDateDisabled}
                  locale={es}
                  className="rounded-md border"
                  classNames={{
                    months: "space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                    day: cn(
                      "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground"
                    ),
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            onClick={calculatePurchasePlan}
            className="w-full"
            disabled={!itemName || !cost || !date}
          >
            Calcular Plan de Compra
          </Button>

          {plan && (
            <div className={cn(
              "mt-4 p-4 rounded-lg",
              plan.canBuyNow ? "bg-green-500/10" : "bg-blue-500/10"
            )}>
              <h3 className="text-lg font-semibold mb-2">
                Plan de Compra: {itemName}
              </h3>
              <p className="text-muted-foreground">{plan.message}</p>
              {plan.canBuyNow && (
                <p className="mt-2 text-muted-foreground">
                  Te quedarían ${plan.remainingSavings?.toFixed(2)} en ahorros
                </p>
              )}
              {!plan.canBuyNow && plan.monthlySavings && (
                <div className="mt-2">
                  <p className="text-muted-foreground">
                    Ahorro mensual sugerido: ${plan.monthlySavings.toFixed(2)}
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

