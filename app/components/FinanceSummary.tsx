import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FinanceSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$5,000.00</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$3,500.00</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neon-green">$1,500.00</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Presupuesto Restante</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$800.00</div>
        </CardContent>
      </Card>
    </div>
  )
}

