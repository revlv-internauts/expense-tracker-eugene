import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { AccountTable } from '@/components/accounts-table';

export default function AccountIndex({ accounts }) {
    return (
        <AppLayout>
            <Head title="Accounts" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <AccountTable accounts={accounts} />
            </div>
        </AppLayout>
    );
}
