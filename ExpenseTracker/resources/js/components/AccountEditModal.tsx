import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

type Account = {
  id: number;
  name: string;
};

type FormData = {
  name: string;
};

type AccountEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
};

export function AccountEditModal({ isOpen, onClose, account }: AccountEditModalProps) {
  const { data, setData, put, processing, errors, reset } = useForm<FormData>({
    name: account?.name || "",
  });

  useEffect(() => {
    if (account) {
      setData({ name: account.name || "" });
    }
  }, [account]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!account) return;

    put(`/accounts/${account.id}`, {
      onSuccess: () => {
        toast.success("Account successfully updated!");
        onClose();
        reset();
      },
      onError: () => {
        toast.error("Failed to update account");
      },
    });
  }

  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Edit Account</h2>
              <p className="mt-1 text-sm text-gray-600">Update the account name.</p>
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
              {/* Name Input */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Account Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
                {processing ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
