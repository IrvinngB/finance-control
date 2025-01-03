'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { getTransactionSummary } from '@/app/actions'

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
  const [plan, setPlan] = useState<PurchasePlan | null>(null)
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    remainingBudget: 0,
  })

  useEffect(() => {
    // Obtener resumen de transacciones desde la API
    const fetchSummary = async () => {
      try {
        const data = await getTransactionSummary()
        setSummary(data)
      } catch (error) {
        console.error("Error al cargar el resumen de transacciones:", error)
      }
    }

    fetchSummary()
  }, [])

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

    const monthlySavings = summary.totalIncome - summary.totalExpenses
    const currentSavings = summary.balance

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
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={isDateDisabled}
                  locale={es}
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
