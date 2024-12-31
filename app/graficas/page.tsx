import { getTransactions } from '../actions'
import ExpenseChart from '../components/ExpenseChart'
import IncomeExpenseChart from '../components/IncomeExpenseChart'
import IncomeChart from '../components/IncomeChart'
import PurchasePlanner from '../components/PurchasePlanner'

export default async function Graficas() {
  const transactions = await getTransactions()

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Gráficas y Análisis</h2>
      
      <div className="grid gap-8 md:grid-cols-2">
        <ExpenseChart transactions={transactions} />
        <IncomeExpenseChart transactions={transactions} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <IncomeChart transactions={transactions} />
        <PurchasePlanner />
      </div>
    </div>
  )
}

