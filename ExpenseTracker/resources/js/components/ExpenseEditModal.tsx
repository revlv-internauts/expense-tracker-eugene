import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export type Expense = {
  id: number;
  account_id: number;
  category_id: number;
  description: string;
  date: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
};

type Account = {
  id: number;
  name: string;
};

type Category = {
  id: number;
  name: string;
};

type ExpenseEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  accounts: Account[];
  categories: Category[];
};

export function ExpenseEditModal({ isOpen, onClose, expense, accounts, categories }: ExpenseEditModalProps) {
  type FormData = {
    account_id: number;
    category_id: number;
    description: string;
    amount: number;
    date: string;
  };

  const { data, setData, put, processing, errors, reset } = useForm<FormData>({
    account_id: expense?.account_id || 0,
    category_id: expense?.category_id || 0,
    description: expense?.description || '',
    amount: expense?.amount || 1,
    date: expense?.date || '',
  });
  //console.log(expense);

  useEffect(() => {
  if (expense) {
    setData({
      account_id: expense.account_id || 0,
      category_id: expense.category_id || 0,
      description: expense.description || '',
      amount: expense.amount || 1,
      date: expense.date || '',
    });
  }
}, [expense]);


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!expense) return;

    put(`/expenses/${expense.id}`, {
      onSuccess: () => {
        toast.success('Expense successfully updated!');
        onClose();
        reset();
      },
      onError: () => {
        toast.error('Failed to update expense');
      },
    });
  }

  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Edit Expense</h2>
              <p className="mt-1 text-sm text-gray-600">
                Update the details of this expense.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-4">
              {/* Account Select */}
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

              {/* Category Select */}
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

              {/* Description Input */}
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

              {/* Amount Input */}
              <div className="sm:col-span-3">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-900">
                  Amount
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₱</span>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    value={data.amount}
                    onChange={(e) => setData('amount', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    className="block w-full rounded-md border border-gray-300 bg-white py-1.5 pl-7 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              {/* Date Input */}
              <div className="sm:col-span-3">
                <label htmlFor="date" className="block text-sm font-medium text-gray-900">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={data.date}
                  onChange={(e) => setData('date', e.target.value)}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex items-center justify-end gap-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}