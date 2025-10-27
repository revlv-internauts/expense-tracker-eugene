<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_index_displays_category()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $accounts = Category::factory()->count(3)->create();

        $response = $this->get('/categories');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
        $page->component('categories/index')
            ->has('category', 3)
    );
    }

    public function test_user_can_create_categories()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post('/categories', [
            'name'=> 'foods',
        ]);

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', [
            'name' => 'foods',
        ]);
    }
    public function test_user_can_update_categories()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $category = Category::factory()->create(['name' => 'old foods']);

        $response = $this->put(route('categories.update', $category), [
            'name' => 'Updated foods',
        ]);

        $response->assertRedirect(route('categories.index'));

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated foods',
        ]);
    }
    public function test_user_can_delete_categories()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $category = Category::factory()->create();

        $response = $this->delete("/categories/{$category->id}");

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
