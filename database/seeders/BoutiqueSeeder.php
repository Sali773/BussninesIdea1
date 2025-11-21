<?php

namespace Database\Seeders;

use App\Models\Boutique;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BoutiqueSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('is_admin', false)->limit(3)->get();

        $boutiques = [
            [
                'name' => 'Elegant Fashion House',
                'description' => 'Premium fashion boutique specializing in luxury clothing',
                'email' => 'elegant@boutique.com',
                'phone' => '123-456-7890',
                'city' => 'New York',
                'country' => 'USA',
            ],
            [
                'name' => 'Style Haven',
                'description' => 'Contemporary fashion with trendy designs',
                'email' => 'style@haven.com',
                'phone' => '234-567-8901',
                'city' => 'Los Angeles',
                'country' => 'USA',
            ],
            [
                'name' => 'Vintage Chic',
                'description' => 'Vintage and retro fashion items',
                'email' => 'vintage@chic.com',
                'phone' => '345-678-9012',
                'city' => 'Chicago',
                'country' => 'USA',
            ],
        ];

        foreach ($boutiques as $index => $boutique) {
            if ($index < count($users)) {
                Boutique::create([
                    'user_id' => $users[$index]->id,
                    'name' => $boutique['name'],
                    'slug' => Str::slug($boutique['name']),
                    'description' => $boutique['description'],
                    'email' => $boutique['email'],
                    'phone' => $boutique['phone'],
                    'city' => $boutique['city'],
                    'country' => $boutique['country'],
                    'is_active' => true,
                ]);
            }
        }
    }
}
