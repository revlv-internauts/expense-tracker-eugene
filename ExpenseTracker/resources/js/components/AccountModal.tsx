import { useState } from 'react';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

type AccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
    const [formData, setFormData] = useState({
        name: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/accounts', formData, {
            onSuccess: () => {
                toast.success('Account created successfully!');
                onClose();
                // Reset form
                setFormData({
                    name: '',
                });
            },
            onError: (errors) => {
                toast.error('Failed to create account');
                console.error(errors);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        })
    }

    if (!isOpen) return null;

    return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
            className="fixed inset-0 w-full h-full bg-black opacity-40"
            onClick={onClose}
            />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
                    {/* Header Content here */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">Add Account</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Create a new account type.
                            </p>
                        </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                        >
                        <X className="h-5 w-5" />
                    </button>
                    </div>
                    {/* Form Content here */}
                    <form className="px-6 py-4" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                                Account Name
                            </label>
                            <input 
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter account name"
                                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                    </form>
                </div>
            </div>
    </div>
    )
}

