<?php

namespace Database\Factories;

use App\Models\Boutique;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BoutiqueFactory extends Factory
{
    protected $model = Boutique::class;

    public function definition(): array
    {
        $name = $this->faker->company();

        return [
            'user_id' => User::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph(),
            'email' => $this->faker->email(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'city' => $this->faker->city(),
            'country' => $this->faker->country(),
            'is_active' => true,
        ];
    }
}
