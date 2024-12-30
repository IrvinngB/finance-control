import TransactionForm from '../components/TransactionForm'
import BudgetForm from '../components/BudgetForm'

export default function Transacciones() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Gestionar Transacciones y Presupuestos</h2>
      <div className="grid gap-8">
        <TransactionForm />
        <BudgetForm />
      </div>
    </div>
  )
}

