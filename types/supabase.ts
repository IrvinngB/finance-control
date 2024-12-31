export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: number
          user_id: string
          amount: number
          description: string
          type: 'income' | 'expense'
          date: string
          created_at?: string
        }
        Insert: {
          id?: number
          user_id: string
          amount: number
          description: string
          type: 'income' | 'expense'
          date: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          amount?: number
          description?: string
          type?: 'income' | 'expense'
          date?: string
          created_at?: string
        }
      }
    }
  }
}

