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

    #[Test]
    public function test_user_can_view_expense_index()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $expenses = Expense::factory()
            ->for(Account::factory())
            ->for(Category::factory())
            ->count(2)
            ->create();

        $response = $this->get(route('expenses.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('expenses/index')
                 ->has('expenses', 2)
        );
    }

    #[Test]
    public function test_user_can_view_expense_create_page()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        Account::factory()->count(2)->create();
        Category::factory()->count(3)->create();

        $response = $this->get(route('expenses.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('expenses/create')
                 ->has('accounts')
                 ->has('categories')
        );
    }

    #[Test]
    public function test_user_can_store_an_expense()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $account = Account::factory()->create();
        $category = Category::factory()->create();

        $data = [
            'account_id' => $account->id,
            'category_id' => $category->id,
            'description' => 'Lunch with client',
            'amount' => 1500,
        ];

        $response = $this->post(route('expenses.store'), $data);

        $response->assertRedirect(route('expenses.index'));
        $this->assertDatabaseHas('expenses', [
            'description' => 'Lunch with client',
            'amount' => 1500,
        ]);
    }

    #[Test]
    public function test_user_can_delete_an_expense()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $expense = Expense::factory()
            ->for(Account::factory())
            ->for(Category::factory())
            ->create();

        $response = $this->delete(route('expenses.destroy', $expense->id));

        $response->assertRedirect(route('expenses.index'));
        $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
    }
}
