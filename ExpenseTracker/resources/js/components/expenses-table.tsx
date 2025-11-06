import { useState } from 'react';
import { type Expense } from '@/types/index';
import { router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { ExpenseModal } from '@/components/ExpenseModal';
import { ExpenseEditModal } from '@/components/ExpenseEditModal';

type ExpenseTableProps = {
  expenses: Expense[];
  categories?: Array<{ id: number; name: string }>;
  accounts?: Array<{ id: number; name: string }>;
}

export function ExpenseTable({ expenses, categories = [], accounts = [] }: ExpenseTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  
  const totalAmount = expenses.reduce((total, expense) => total + Number(expense.amount), 0);

  function handleDelete(id: number) {
    if(confirm("Are you sure you want to delete this expense?")) {
      router.delete(`/expenses/${id}`, {
        onSuccess: () => {
          toast.success('Expense deleted successfully!');
        },
        onError: (error) => {
          toast.error('Failed to delete expense');
          console.error(error);
        },
      })
    }
  }

  function handleEdit(expense: Expense) {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  }

  function handleCloseEditModal() {
    setIsEditModalOpen(false);
    setSelectedExpense(null);
  }

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Create Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        accounts={accounts}
      />

      {/* Edit Expense Modal */}
      <ExpenseEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        expense={selectedExpense}
        categories={categories}
        accounts={accounts}
      />
      
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">Expenses</h1>
            <p className="mt-2 text-sm text-gray-700">
              Track your expenses by category and account.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setIsModalOpen(true)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Plus className="inline w-4 h-4 mr-1" />
              Add Expense
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
                <table className="relative min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-bold text-gray-900 sm:pl-6">Account</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">Category</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">Amount</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">Description</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">Date</th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-bold text-gray-900 sm:pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {expenses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-sm text-gray-500">
                          No expenses recorded yet.
                        </td>
                      </tr>
                    ) : (
                      expenses.map((expense) => (
                        <tr key={expense.id}>
                          <td className="py-4 pr-3 pl-4 text-sm whitespace-nowrap text-gray-900 sm:pl-6">{expense.account?.name ?? '—'}</td>
                          <td className="py-4 px-3 text-sm whitespace-nowrap text-gray-900">{expense.category?.name ?? '—'}</td>
                          <td className="py-4 px-3 text-sm whitespace-nowrap text-gray-900">₱{Number(expense.amount).toFixed(2)}</td>
                          <td className="py-4 px-3 text-sm whitespace-nowrap text-gray-900">{expense.description}</td>
                          <td className="py-4 px-3 text-sm whitespace-nowrap text-gray-900">{expense.date}</td>
                          <td className="py-4 pr-4 pl-3 text-sm font-medium whitespace-nowrap sm:pr-6">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(expense)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit<span className="sr-only">, {expense.description}</span>
                              </button>
                              <button
                                onClick={() => handleDelete(expense.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={2} className="py-4 pr-3 pl-4 text-sm font-bold text-gray-900 sm:pl-6">
                        Total Amount:
                      </td>
                      <td className="py-4 px-3 text-sm font-bold text-gray-900">
                        ₱{totalAmount.toFixed(2)}
                      </td>
                      <td colSpan={3}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}