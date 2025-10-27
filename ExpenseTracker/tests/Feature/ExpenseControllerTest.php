<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Account;
use App\Models\Category;
use App\Models\Expense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guest_cannot_access_expenses()
    {
        $this->get(route('expenses.index'))->assertRedirect(route('login'));
    }

    /** @test */
    public function authenticated_user_can_view_their_own_expenses()
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::factory()->create(['user_id' => $user->id]);
        $expense = Expense::factory()->create([
            'user_id' => $user->id,
            'account_id' => $account->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($user)->get(route('expenses.index'));

        $response->assertInertia(fn ($page) =>
            $page->component('expenses/index')
                 ->has('expenses', 1)
                 ->where('expenses.0.description', $expense->description)
        );
    }

    /** @test */
    public function user_can_access_create_expense_page()
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('expenses.create'));

        $response->assertInertia(fn ($page) =>
            $page->component('expenses/create')
                 ->has('accounts')
                 ->has('categories')
        );
    }

    /** @test */
    public function user_can_create_expense_with_valid_data()
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->post(route('expenses.store'), [
            'account_id' => $account->id,
            'category_id' => $category->id,
            'description' => 'Coffee',
            'amount' => 120,
            'date' => now()->toDateString(),
        ]);

        $response->assertRedirect(route('expenses.index'));
        $this->assertDatabaseHas('expenses', [
            'user_id' => $user->id,
            'description' => 'Coffee',
            'amount' => 120,
            'date' => now()->toDateString(),
        ]);
    }

    /** @test */
    public function expense_creation_requires_all_fields()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('expenses.store'), []);

        $response->assertSessionHasErrors(['account_id', 'category_id', 'description', 'amount']);
    }

    /** @test */
    public function user_can_edit_their_own_expense()
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::factory()->create(['user_id' => $user->id]);
        $expense = Expense::factory()->create([
            'user_id' => $user->id,
            'account_id' => $account->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($user)->get(route('expenses.edit', $expense));

        $response->assertInertia(fn ($page) =>
            $page->component('expenses/edit')
                 ->where('expense.id', $expense->id)
                 ->has('accounts')
                 ->has('categories')
        );
    }

    /** @test */
    public function user_cannot_edit_someone_elses_expense()
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $expense = Expense::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user)
             ->get(route('expenses.edit', $expense))
             ->assertForbidden();
    }

    /** @test */
    public function user_can_update_their_own_expense()
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::factory()->create(['user_id' => $user->id]);
        $expense = Expense::factory()->create([
            'user_id' => $user->id,
            'account_id' => $account->id,
            'category_id' => $category->id,
            'date' => now()->toDateString(),
        ]);

        $response = $this->actingAs($user)->put(route('expenses.update', $expense), [
            'account_id' => $account->id,
            'category_id' => $category->id,
            'description' => 'Updated Expense',
            'amount' => 999,
            'date' => now()->toDateString(),
        ]);

        $response->assertRedirect(route('expenses.index'));
        $this->assertDatabaseHas('expenses', [
            'id' => $expense->id,
            'description' => 'Updated Expense',
            'amount' => 999,
            'date' => now()->toDateString(),
        ]);
    }

    /** @test */
    public function user_cannot_update_someone_elses_expense()
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $expense = Expense::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user)
             ->put(route('expenses.update', $expense), [
                 'description' => 'Hack',
                 'amount' => 999,
                 'account_id' => 1,
                 'category_id' => 1,
             ])
             ->assertForbidden();
    }

    /** @test */
    public function user_can_delete_their_own_expense()
    {
        $user = User::factory()->create();
        $expense = Expense::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete(route('expenses.destroy', $expense));

        $response->assertRedirect(route('expenses.index'));
        $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
    }

    /** @test */
    public function user_cannot_delete_someone_elses_expense()
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $expense = Expense::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user)
             ->delete(route('expenses.destroy', $expense))
             ->assertForbidden();

        $this->assertDatabaseHas('expenses', ['id' => $expense->id]);
    }

    /** @test */
    public function user_can_create_expense_with_a_date()
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::factory()->create(['user_id' => $user->id]);

        $date = now()->toDateString();

        $response = $this->actingAs($user)->post(route('expenses.store'), [
            'account_id' => $account->id,
            'category_id' => $category->id,
            'description' => 'Lunch',
            'amount' => 250,
            'date' => $date,
        ]);

        $response->assertRedirect(route('expenses.index'));
        $this->assertDatabaseHas('expenses', [
        'user_id' => $user->id,
        'description' => 'Lunch',
        'amount' => 250,
        'date' => $date,
        ]);
    }

    /** @test */    
    public function expense_creation_requires_a_date_field()
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->post(route('expenses.store'), [
            'account_id' => $account->id,
            'category_id' => $category->id,
            'description' => 'Missing date test',
            'amount' => 500,
        ]);

        $response->assertSessionHasErrors(['date']);
    }

    /** @test */
    public function edit_page_shows_existing_expense_date()
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::factory()->create(['user_id' => $user->id]);
        $expense = Expense::factory()->create([
            'user_id' => $user->id,
            'account_id' => $account->id,
            'category_id' => $category->id,
            'date' => '2025-10-27',
        ]);

        $response = $this->actingAs($user)->get(route('expenses.edit', $expense));

        $response->assertInertia(fn ($page) =>
            $page->component('expenses/edit')
                 ->where('expense.date', '2025-10-27')
        );
    }
}
