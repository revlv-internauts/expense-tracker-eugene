import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ExpenseTable } from '@/components/expenses-table';
import { Expense } from '@/types/';
 
interface ExpensePageProps {
    expenses: Expense[];
}

export default function ExpenseIndex({ expenses }: ExpensePageProps) {
    return (
        <AppLayout>
            <Head title="Expenses" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <ExpenseTable expenses={expenses} />
            </div>
        </AppLayout>
    );
}
