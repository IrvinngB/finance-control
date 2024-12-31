'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/supabase'

interface TransactionSummary {
  totalIncome: number
  totalExpenses: number
  balance: number
  remainingBudget: number
}

export async function getTransactionSummary(): Promise<TransactionSummary> {
  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('No user found')

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)

  if (error) throw error

  const summary = transactions?.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc.totalIncome += transaction.amount
    } else {
      acc.totalExpenses += transaction.amount
    }
    return acc
  }, { totalIncome: 0, totalExpenses: 0 })

  return {
    totalIncome: summary?.totalIncome || 0,
    totalExpenses: summary?.totalExpenses || 0,
    balance: (summary?.totalIncome || 0) - (summary?.totalExpenses || 0),
    remainingBudget: 0
  }
}

export async function addTransaction(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('No user found')

  const amount = parseFloat(formData.get('amount') as string)
  const description = formData.get('description') as string
  const type = formData.get('type') as 'income' | 'expense'
  const date = formData.get('date') as string

  if (isNaN(amount) || !description || !type || !date) {
    throw new Error('Invalid form data')
  }

  const { error } = await supabase
    .from('transactions')
    .insert([
      {
        user_id: user.id,
        amount,
        description,
        type,
        date
      }
    ])

  if (error) throw error

  revalidatePath('/')
  revalidatePath('/transacciones')
  revalidatePath('/historial')
  revalidatePath('/graficas')
}

export async function getTransactions() {
  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('No user found')

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) throw error

  return data
}

export async function updateTransaction(id: number, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('No user found')

  const amount = parseFloat(formData.get('amount') as string)
  const description = formData.get('description') as string
  const type = formData.get('type') as 'income' | 'expense'
  const date = formData.get('date') as string

  if (isNaN(amount) || !description || !type || !date) {
    throw new Error('Invalid form data')
  }

  const { error } = await supabase
    .from('transactions')
    .update({
      amount,
      description,
      type,
      date
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/')
  revalidatePath('/transacciones')
  revalidatePath('/historial')
  revalidatePath('/graficas')
}

export async function deleteTransaction(id: number) {
  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({ cookies: () => cookieStore })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('No user found')

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/')
  revalidatePath('/transacciones')
  revalidatePath('/historial')
  revalidatePath('/graficas')
}

