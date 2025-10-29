<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('user_id', Auth::id())->get();
        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('categories/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
        ]);
        Category::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);
        return to_route('categories.index');
    }

    public function edit(Category $category)
    {
        if ($category->user_id !== Auth::id()) {
            abort(403, 'Unauthorize action.');
        }
        // dd($request->all());
        return Inertia::render('categories/edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== Auth::id()) {
            abort(403, 'Unauthorize action.');
        }
        $validated = $request->validate([
            'name' => 'required',
        ]);

        $category->update($validated);
        return to_route('categories.index');
    }

    public function destroy(Category $category)
    {
        try {
            if ($category->user_id !== Auth::id()) {
                return to_route('categories.index')->with('error', 'Unauthorized action.');
            }
            
            $category->delete();
            
            return to_route('categories.index')->with('success', 'Category deleted successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23503' || strpos($e->getMessage(), 'foreign key constraint') !== false) {
                return to_route('categories.index')
                    ->with('error', 'Cannot delete this category because it has associated expenses.');
            }
            
            \Log::error('Category deletion failed: ' . $e->getMessage());
            return to_route('categories.index')->with('error', 'Failed to delete category.');
        } catch (\Exception $e) {
            \Log::error('Category deletion failed: ' . $e->getMessage());
            return to_route('categories.index')->with('error', 'An unexpected error occurred.');
        }
    }
}
