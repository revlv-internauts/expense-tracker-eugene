import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Expense {
    id: number;
    account_id: number;
    category_id: number;
    date: string;
    description: string;
    amount: number;
    created_at?: string;
    updated_at?: string;

    account?: {
        id: number;
        name: string;
    }
    category?: {
        id: number;
        name: string;
    }
}

export interface Category {
    id: number;
    name: string;

    description?: string;
}

export interface Account {
    id: number;
    name: string;

    description?: string;
}
