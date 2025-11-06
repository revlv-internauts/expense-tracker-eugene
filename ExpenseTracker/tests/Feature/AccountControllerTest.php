<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /** @test */
    public function index_displays_only_authenticated_users_accounts()
    {
        $otherUser = User::factory()->create();
        
        $userAccount = Account::factory()->create(['user_id' => $this->user->id]);
        $otherAccount = Account::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)->get(route('accounts.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('accounts/index')
                ->has('accounts', 1)
                ->where('accounts.0.id', $userAccount->id)
        );
    }

    /** @test */
    public function index_requires_authentication()
    {
        $response = $this->get(route('accounts.index'));
        
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function create_displays_form()
    {
        $response = $this->actingAs($this->user)->get(route('accounts.create'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('accounts/create'));
    }

    /** @test */
    public function create_requires_authentication()
    {
        $response = $this->get(route('accounts.create'));
        
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function store_creates_account_for_authenticated_user()
    {
        $data = ['name' => 'Test Account'];

        $response = $this->actingAs($this->user)
            ->post(route('accounts.store'), $data);

        $response->assertRedirect(route('accounts.index'));
        
        $this->assertDatabaseHas('accounts', [
            'name' => 'Test Account',
            'user_id' => $this->user->id,
        ]);
    }

    /** @test */
    public function store_validates_name_is_required()
    {
        $response = $this->actingAs($this->user)
            ->post(route('accounts.store'), ['name' => '']);

        $response->assertSessionHasErrors('name');
        $this->assertDatabaseCount('accounts', 0);
    }

    /** @test */
    public function store_requires_authentication()
    {
        $response = $this->post(route('accounts.store'), ['name' => 'Test']);
        
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function edit_displays_form_for_owned_account()
    {
        $account = Account::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->get(route('accounts.edit', $account));

        $response->assertOk();
        $response->assertInertia(fn ($page) => 
            $page->component('accounts/edit')
                ->where('account.id', $account->id)
                ->where('account.name', $account->name)
        );
    }

    /** @test */
    public function edit_prevents_access_to_other_users_account()
    {
        $otherUser = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->get(route('accounts.edit', $account));

        $response->assertForbidden();
    }

    /** @test */
    public function edit_requires_authentication()
    {
        $account = Account::factory()->create(['user_id' => $this->user->id]);
        
        $response = $this->get(route('accounts.edit', $account));
        
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function update_modifies_owned_account()
    {
        $account = Account::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'Old Name'
        ]);

        $response = $this->actingAs($this->user)
            ->put(route('accounts.update', $account), ['name' => 'New Name']);

        $response->assertRedirect(route('accounts.index'));
        
        $this->assertDatabaseHas('accounts', [
            'id' => $account->id,
            'name' => 'New Name',
        ]);
    }

    /** @test */
    public function update_validates_name_is_required()
    {
        $account = Account::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->put(route('accounts.update', $account), ['name' => '']);

        $response->assertSessionHasErrors('name');
    }

    /** @test */
    public function update_prevents_modifying_other_users_account()
    {
        $otherUser = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->put(route('accounts.update', $account), ['name' => 'Hacked']);

        $response->assertForbidden();
        
        $this->assertDatabaseMissing('accounts', [
            'id' => $account->id,
            'name' => 'Hacked',
        ]);
    }

    /** @test */
    public function update_requires_authentication()
    {
        $account = Account::factory()->create(['user_id' => $this->user->id]);
        
        $response = $this->put(route('accounts.update', $account), ['name' => 'Test']);
        
        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function destroy_deletes_owned_account()
    {
        $account = Account::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->delete(route('accounts.destroy', $account));

        $response->assertRedirect(route('accounts.index'));
        $this->assertDatabaseMissing('accounts', ['id' => $account->id]);
    }

    /** @test */
    public function test_destroy_prevents_deleting_other_users_account()
    {
        $otherUser = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $otherUser->id]);
        
        $response = $this->actingAs($this->user)
            ->delete(route('accounts.destroy', $account));
        
        $response->assertRedirect(route('accounts.index'))
                 ->assertSessionHas('error', 'Unauthorized action.');
        
        $this->assertDatabaseHas('accounts', ['id' => $account->id]);
    }

    /** @test */
    public function destroy_requires_authentication()
    {
        $account = Account::factory()->create(['user_id' => $this->user->id]);
        
        $response = $this->delete(route('accounts.destroy', $account));
        
        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('accounts', ['id' => $account->id]);
    }
}