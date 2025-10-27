import { useForm, Link } from '@inertiajs/react'
import toast, { Toaster } from 'react-hot-toast'

export type Category = {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

interface CategoryCreateProps {
  categories: Category[]
}

export default function Create({ accounts }: CategoriesCreateProps) {

  const { data, setData, post, processing, errors } = useForm<FormData>({
    name: '',
  })

  function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  post('/categories', {
    onSuccess: () => {
      toast.success('Category added successfully!');
    },
    onError: () => {
      toast.error('Failed to add category');
    }
  })
}

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto py-10">
      <div className="space-y-12 sm:space-y-16">
        {/* Header */}
        <div>
          <h2 className="text-base font-semibold text-gray-900">Create Categories</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            Fill in the details below to add a new category.
          </p>
        </div>

        {/* Form to be filled */}
        <div className="border-b border-gray-900/10 pb-12">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Category Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., Groceries, Transportation, Entertainment"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link href="/categories" className="text-sm font-semibold text-gray-900">
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
  )
}