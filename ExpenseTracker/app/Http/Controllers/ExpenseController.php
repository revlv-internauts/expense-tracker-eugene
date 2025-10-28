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
    public function index() //index.tsx na frontend to nag co-communicate
    {
        $expenses = Expense::where('user_id', Auth::id()) //fefetch niya lahat ng data sa expenses table na depende sa user_id ng nakalogin na user
            ->with('category', 'account') //eloquent eager loading, ibig sabihin fefetch niya yung information related dun sa foregnId ng category_id and account_id
            ->latest() //naka sort to, ibig sabihin yung latest sa column na created_at yung unang madidisplay
            ->get(); //eto yung nag eexecute ng command sa query

        return Inertia::render('expenses/index', [ //Inertia::render = mag render daw ng inertia page, 'expenses/index' eto yung directory ng components sa react
            'expenses' => $expenses, // 'expenses' eto yung keyname na binabato mo sa frontend as a props, $expenses eto yung nag cocontain ng mga datas na nacollect sa query kanina
        ]);
    }

    public function create() //create.tsx na component to nag co-communicate
    {
        $accounts = Account::where('user_id', Auth::id())->get(); //Account::where, nag start ng query patungkol sa accounts table, yung user_id is nag fifilter para yung ma fetch na accounts information is yung patungkol lang sa user_id ng naka log in na user
        $categories = Category::where('user_id', Auth::id())->get(); //same functionality sa accounts

        return Inertia::render('expenses/create', [ //Inertia::render = inertia method to render components in the expenses/create
            'accounts' => $accounts, //array of props to na sinesend sa frontend na nag cocontain ng datas na na fetch sa unang query
            'categories' => $categories, //array of props din ro na sinesend sa frontend na nag cocontain ng datas na na fetch sa unang query
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

        //check if account and category belong to the authenticated user
        $account = Account::where('id', $request->account_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $category = Category::where('id', $request->category_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

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
