<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::where('user_id', Auth::id())
            ->with('category', 'account')
            ->latest()
            ->get();

        return Inertia::render('expenses/index', [
            'expenses' => $expenses,
        ]);
    }

    public function create()
    {
        $accounts = Account::where('user_id', Auth::id())->get();
        $categories = Category::where('user_id', Auth::id())->get();

        return Inertia::render('expenses/create', [
            'accounts' => $accounts,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id' => ['required', 'exists:accounts,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['required', 'string'],
            'amount' => ['required', 'numeric'],
            'date' => ['required', 'date'],
        ]);

        Expense::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return to_route('expenses.index')->with('success', 'Expense added successfully.');
    }

    public function edit(Expense $expense)
    {
        if ($expense->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $accounts = Account::where('user_id', Auth::id())->get();
        $categories = Category::where('user_id', Auth::id())->get();

        return Inertia::render('expenses/edit', [
            'expense' => $expense,
            'accounts' => $accounts,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        if ($expense->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'account_id' => ['required', 'exists:accounts,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['required', 'string'],
            'amount' => ['required', 'numeric'],
            'date' => ['required', 'date'],
        ]);

        $expense->update($validated);

        return to_route('expenses.index')->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense)
    {
        if ($expense->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $expense->delete();

        return to_route('expenses.index')->with('success', 'Expense deleted.');
    }
}
