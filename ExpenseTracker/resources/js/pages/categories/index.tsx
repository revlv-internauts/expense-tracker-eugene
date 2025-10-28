import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { CategoryTable } from '@/components/categories-table';

interface CategoryPageProps {
    categories: Category[];
}

export default function CategoryIndex({ categories }: CategoryPageProps) {
    return (
        <AppLayout>
            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <CategoryTable categories={categories} />
            </div>
        </AppLayout>
    );
}
