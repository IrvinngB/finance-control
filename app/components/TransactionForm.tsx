'use client'

import { useState, useTransition } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addTransaction } from '../actions'

type TransactionType = 'expense' | 'income'

interface PredefinedDescriptions {
  [key: string]: string[]
}

const predefinedDescriptions: PredefinedDescriptions = {
  expense: [
    'Alimentación',
    'Transporte',
    'Servicios',
    'Entretenimiento',
    'Salud',
    'Educación',
    'Ropa',
    'Hogar',
    'Mascotas'
  ],
  income: [
    'Salario',
    'Freelance',
    'Inversiones',
    'Ventas',
    'Bonificaciones',
    'Alquiler',
    'Dividendos',
    'Comisiones',
    'Reembolsos'
  ]
}

export default function TransactionForm() {
  const [type, setType] = useState<TransactionType>('expense')
  const [description, setDescription] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    
    const form = event.currentTarget
    const formData = new FormData(form)
    
    const finalDescription = formData.get('description') === 'custom' 
      ? formData.get('customDescription') 
      : formData.get('description')

    if (!finalDescription) {
      setError('La descripción es requerida')
      return
    }

    const amount = formData.get('amount')
    if (!amount || isNaN(Number(amount))) {
      setError('El monto debe ser un número válido')
      return
    }

    const date = formData.get('date')
    if (!date) {
      setError('La fecha es requerida')
      return
    }

    const finalFormData = new FormData()
    finalFormData.append('amount', amount as string)
    finalFormData.append('description', finalDescription as string)
    finalFormData.append('type', type)
    finalFormData.append('date', date as string)

    startTransition(async () => {
      try {
        await addTransaction(finalFormData)
        form.reset()
        setDescription('')
      } catch (err) {
        setError('Error al agregar la transacción. Por favor intente nuevamente.')
      }
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Agregar Transacción</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-muted-foreground">
              Monto
            </label>
            <Input
              type="number"
              id="amount"
              name="amount"
              className="mt-1"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">
              Descripción
            </label>
            <Select 
              name="description" 
              value={description} 
              onValueChange={setDescription}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona la descripción" />
              </SelectTrigger>
              <SelectContent>
                {predefinedDescriptions[type].map((desc) => (
                  <SelectItem key={desc} value={desc}>{desc}</SelectItem>
                ))}
                <SelectItem value="custom">Otros</SelectItem>
              </SelectContent>
            </Select>
            {description === 'custom' && (
              <Input
                type="text"
                name="customDescription"
                className="mt-2"
                placeholder="Ingresa descripción personalizada"
                required
              />
            )}
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-muted-foreground">
              Tipo
            </label>
            <Select 
              name="type" 
              value={type} 
              onValueChange={(value: TransactionType) => {
                setType(value)
                setDescription('')
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Gasto</SelectItem>
                <SelectItem value="income">Ingreso</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-muted-foreground">
              Fecha
            </label>
            <Input
              type="date"
              id="date"
              name="date"
              className="mt-1"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Agregando..." : "Agregar Transacción"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

