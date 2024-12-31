import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getTransactions, deleteTransaction, updateTransaction } from '../actions'
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function TransactionList() {
  const transactions = await getTransactions()

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableCaption>Lista de transacciones recientes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.date}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.type === 'income' ? 'Ingreso' : 'Gasto'}</TableCell>
              <TableCell className={`text-right ${
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Editar Transacción</DialogTitle>
                      </DialogHeader>
                      <form action={updateTransaction.bind(null, transaction.id)}>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <label>Descripción</label>
                            <Input
                              name="description"
                              defaultValue={transaction.description}
                            />
                          </div>
                          <div className="grid gap-2">
                            <label>Monto</label>
                            <Input
                              type="number"
                              name="amount"
                              defaultValue={transaction.amount}
                            />
                          </div>
                          <div className="grid gap-2">
                            <label>Tipo</label>
                            <Select name="type" defaultValue={transaction.type}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="income">Ingreso</SelectItem>
                                <SelectItem value="expense">Gasto</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <label>Fecha</label>
                            <Input
                              type="date"
                              name="date"
                              defaultValue={transaction.date}
                            />
                          </div>
                          <Button type="submit">Guardar Cambios</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <form action={deleteTransaction.bind(null, transaction.id)}>
                    <Button variant="ghost" size="sm" type="submit">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

