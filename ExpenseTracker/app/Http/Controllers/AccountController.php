<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Account::where('user_id', Auth::id())->get();
        
        return Inertia::render('accounts/index', [
            'accounts' => $accounts,
        ]);
    }

    public function create()
    {
        return Inertia::render('accounts/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
        ]);

        // Auto-assign user_id
        Account::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return to_route('accounts.index');
    }

    public function edit(Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('accounts/edit', [
            'account' => $account,
        ]);
    }

    public function update(Request $request, Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required'
        ]);

        $account->update($validated);

        return to_route('accounts.index');
    }

    public function destroy(Account $account)
    {
        try {
            if ($account->user_id !== Auth::id()) {
                return to_route('accounts.index')->with('error', 'Unauthorized action.');
            }

            $account->delete();

            return to_route('accounts.index')->with('success', 'Account deleted successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23503' || strpos($e->getMessage(), 'foreign key constraint') !== false) {
                return to_route('accounts.index')
                    ->with('error', 'Cannot delete this account because it has associated expenses.');
            }

            Log::error('Account deletion failed: ' . $e->getMessage());
            return to_route('accounts.index')->with('error', 'Failed to delete account.');
        } catch (\Exception $e) {
            Log::error('Account deletion failed: ' . $e->getMessage());
            return to_route('accounts.index')->with('error', 'An unexpected error occurred.');
        }
    }
}
