<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guest_cannot_access_categories()
    {
        $this->get(route('categories.index'))->assertRedirect(route('login'));
    }

    /** @test */
    public function authenticated_user_can_view_their_own_categories()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('categories.index'));

        $response->assertInertia(fn ($page) => 
            $page->component('categories/index')
                 ->has('categories', 1)
                 ->where('categories.0.name', $category->name)
        );
    }

    /** @test */
    public function user_can_create_a_category()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('categories.store'), [
            'name' => 'Food',
        ]);

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', [
            'name' => 'Food',
            'user_id' => $user->id,
        ]);
    }

    /** @test */
    public function category_requires_a_name_on_create()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('categories.store'), [
            'name' => '',
        ]);

        $response->assertSessionHasErrors('name');
    }

    /** @test */
    public function user_can_edit_their_own_category()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('categories.edit', $category));

        $response->assertInertia(fn ($page) => 
            $page->component('categories/edit')
                 ->where('category.id', $category->id)
                 ->where('category.name', $category->name)
        );
    }

    /** @test */
    public function user_cannot_edit_someone_elses_category()
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user)
             ->get(route('categories.edit', $category))
             ->assertForbidden();
    }

    /** @test */
    public function user_can_update_their_own_category()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->put(route('categories.update', $category), [
            'name' => 'Updated Category',
        ]);

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category',
        ]);
    }

    /** @test */
    public function user_cannot_update_someone_elses_category()
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user)
             ->put(route('categories.update', $category), ['name' => 'Hack Attempt'])
             ->assertForbidden();

        $this->assertDatabaseMissing('categories', ['name' => 'Hack Attempt']);
    }

    /** @test */
    public function user_can_delete_their_own_category()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete(route('categories.destroy', $category));

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    /** @test */
    public function test_user_cannot_delete_someone_elses_category()
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $other->id]);
        
        $this->actingAs($user)
             ->delete(route('categories.destroy', $category))
             ->assertRedirect(route('categories.index'))
             ->assertSessionHas('error', 'Unauthorized action.');
        
        // Verify category still exists
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }
}
