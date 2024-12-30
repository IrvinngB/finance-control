'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TransactionForm() {
  const [type, setType] = useState('expense')
  const [description, setDescription] = useState('')

  const predefinedDescriptions = {
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

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = {
      amount: formData.get('amount'),
      description: formData.get('description') === 'custom' ? formData.get('customDescription') : formData.get('description'),
      type: formData.get('type'),
      date: formData.get('date')
    }
    console.log('Transaction data:', data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Transacción</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-400">Monto</label>
            <Input
              type="number"
              id="amount"
              name="amount"
              className="mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400">Descripción</label>
            <Select name="description" value={description} onValueChange={setDescription}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona la descripción" />
              </SelectTrigger>
              <SelectContent>
                {predefinedDescriptions[type].map((desc) => (
                  <SelectItem key={desc} value={desc}>{desc}</SelectItem>
                ))}
                <SelectItem value="Otros">Otros</SelectItem>
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
            <label htmlFor="type" className="block text-sm font-medium text-gray-400">Tipo</label>
            <Select name="type" value={type} onValueChange={(value) => {
              setType(value)
              setDescription('')
            }}>
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
            <label htmlFor="date" className="block text-sm font-medium text-gray-400">Fecha</label>
            <Input
              type="date"
              id="date"
              name="date"
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" className="w-full">Agregar Transacción</Button>
        </form>
      </CardContent>
    </Card>
  )
}