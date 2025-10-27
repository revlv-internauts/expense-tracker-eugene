<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Account;
use App\Models\User;

class AccountControllerTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_index_displays_accounts()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $accounts = Account::factory()->count(3)->create();

        $response = $this->get('/accounts');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
        $page->component('accounts/index')
            ->has('accounts', 3)
    );
    }

    public function test_user_can_create_account()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post('/accounts', [
            'name'=> 'Savings Account',
        ]);

        $response->assertRedirect(route('accounts.index'));
        $this->assertDatabaseHas('accounts', [
            'name' => 'Savings Account',
        ]);
    }

    public function test_user_can_update_account()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $account = Account::factory()->create(['name' => 'Old Account']);

        $response = $this->put(route('accounts.update', $account), [
            'name' => 'Updated Account',
        ]);

        $response->assertRedirect(route('accounts.index'));

        $this->assertDatabaseHas('accounts', [
            'id' => $account->id,
            'name' => 'Updated Account',
        ]);
    }

    public function test_user_can_delete_account()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $account = Account::factory()->create();

        $response = $this->delete("/accounts/{$account->id}");

        $response->assertRedirect(route('accounts.index'));
        $this->assertDatabaseMissing('accounts', ['id' => $account->id]);
    }
}
