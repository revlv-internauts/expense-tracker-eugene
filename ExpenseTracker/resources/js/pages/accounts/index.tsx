import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { AccountTable } from '@/components/accounts-table';
import { type Account } from '@/types/index';

interface AccountPageProps {
    accounts: Account[];
}

export default function AccountIndex({ accounts }: AccountPageProps) {
    return (
        <AppLayout>
            <Head title="Accounts" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <AccountTable accounts={accounts} />
            </div>
        </AppLayout>
    );
}
