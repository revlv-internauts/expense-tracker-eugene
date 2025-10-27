import { useForm, Link } from '@inertiajs/react'
import toast, { Toaster } from 'react-hot-toast'

export type Expense = {
  id: number
  account_id: number
  category_id: number
  description: string
  amount: number
  created_at?: string
  updated_at?: string
}

type Account = {
  id: number
  name: string
}

type Category = {
  id: number
  name: string
}

interface ExpenseEditProps {
  expense: Expense
  accounts: Account[]
  categories: Category[]
}

export default function Edit({ expense, accounts, categories }: ExpenseEditProps) {
  type FormData = {
    account_id: number
    category_id: number
    description: string
    amount: number
  }

  const { data, setData, put, processing, errors } = useForm<FormData>({
    account_id: expense.account_id,
    category_id: expense.category_id,
    description: expense.description,
    amount: expense.amount,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/expenses/${expense.id}`, {
      onSuccess: () => {
        toast.success('Expense succesfully updated!')
      },
      onError: () => {
        toast.error('Failed to update expense')
      }
    })
  }

  return (
    <>
    <Toaster position='top-right' />
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto py-10">
      <div className="space-y-12 sm:space-y-16">
        {/* Header */}
        <div>
          <h2 className="text-base font-semibold text-gray-900">Edit Expense</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            Update the details of this expense.
          </p>
        </div>

        {/* Form Fields */}
        <div className="border-b border-gray-900/10 pb-12">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="account_id" className="block text-sm font-medium text-gray-900">
                Account
              </label>
              <select
                id="account_id"
                name="account_id"
                value={data.account_id}
                onChange={(e) => setData('account_id', Number(e.target.value))}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              >
                <option value={0}>Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
              {errors.account_id && (
                <p className="mt-1 text-sm text-red-600">{errors.account_id}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-900">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                value={data.category_id}
                onChange={(e) => setData('category_id', Number(e.target.value))}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              >
                <option value={0}>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
              )}
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-900">
                Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                value={data.amount}
                onChange={(e) => setData('amount', e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link href="/expenses" className="text-sm font-semibold text-gray-900">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={processing}
          className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {processing ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
    </>
  )
}
