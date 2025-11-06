import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

type Category = {
  id: number;
  name: string;
};

type FormData = {
  name: string;
};

type CategoryEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
};

export function CategoryEditModal({ isOpen, onClose, category }: CategoryEditModalProps) {
  const { data, setData, put, processing, errors, reset } = useForm<FormData>({
    name: category?.name || '',
  });

  useEffect(() => {
    if (category) setData({ name: category.name || '' });
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    put(`/categories/${category.id}`, {
      onSuccess: () => {
        toast.success('Account successfully updated!');
        onClose();
        reset();
      },
      onError: () => toast.error('Failed to update account'),
    });
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex min-h-full items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black opacity-40"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Category</h2>
            <p className="text-sm text-gray-500">Update the category details.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-x-3">
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
  );
}
