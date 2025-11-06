import { type Account } from '@/types/index';
import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Button } from '@headlessui/react';
import { AccountModal } from '@/components/AccountModal';
import { AccountEditModal } from '@/components/AccountEditModal';

interface PageProps {
    flash?: {
        error?: string;
        success?: string;
    }
}
type AccountTableProps = {
    accounts: Account[];
}


export function AccountTable({ accounts }: AccountTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  function handleDelete(id: number) {
  if (confirm("Are you sure you want to delete this account?")) {
    router.delete(`/accounts/${id}`, {
      onSuccess: (page: any) => {
        // Add console.log to debug
        console.log('Flash messages:', page.props.flash);
        
        // Check flash messages from the server
        if (page.props.flash?.error) {
          toast.error(page.props.flash.error);
        } else if (page.props.flash?.success) {
          toast.success(page.props.flash.success);
        } else {
          // This shouldn't run if flash messages are working
          toast.success('Account deleted successfully!');
        }
      },
      onError: (errors) => {
        console.log('Errors:', errors);
        toast.error('Failed to delete account');
      },
    })
  }
}

    function handleEdit(account: Account) {
        setSelectedAccount(account);
        setIsEditModalOpen(true);
    }

    function handleCloseEditModal() {
        setIsEditModalOpen(false);
        setSelectedAccount(null);
    }

    return (
    <>
        <Toaster position="top-right" />

        <AccountModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            />

        <AccountEditModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            account={selectedAccount}
        />

        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">Accounts</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Add Accounts Type
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    >
                        <Plus className="inline w-4 h-4 mr-1" />
                        Add Account
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
                                      <th
                                        scope="col"
                                        className="py-3.5 pr-3 pl-4 text-left text-sm font-bold text-gray-900 sm:pl-6"
                                      >
                                        Name
                                      </th>
                                      <th
                                        scope="col"
                                        className="py-3.5 pr-4 pl-3 text-right text-sm font-bold text-gray-900 sm:pr-6"
                                      >
                                        Actions
                                      </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {accounts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-6 text-center text-sm text-gray-500">
                                                No accounts yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        accounts.map((account) => (
                                            <tr key={account.id}>
                                                <td className="py-4 pr-3 pl-4 text-sm whitespace-nowrap text-gray-900 sm:pl-6">
                                                    {account.name}
                                                </td>
                                                <td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                                                    <div className='flex justify-end space-x-2'>
                                                    <button
                                                        onClick={() => handleEdit(account)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                    Edit<span className="sr-only">, {account.description}</span>
                                                    </button>
                                                    <button
                                                    onClick={() => handleDelete(account.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    >Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}