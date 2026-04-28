<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class ResidentsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->lastName(),
            'last_name' => fake()->lastName(),
            'birth_date' => fake()->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'gender' => fake()->randomElement(['Male', 'Female']),
            'civil_status' => fake()->randomElement(['Single', 'Married', 'Widowed', 'Separated']),
            'phone' => fake()->phoneNumber(), // Fixed from contact_number
            'email' => fake()->unique()->safeEmail(),
            'address' => fake()->address(),
            'purok' => fake()->randomElement(['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5']),
            'occupation' => fake()->jobTitle(),
            'is_voter' => fake()->boolean(70), // 70% chance they are a voter
            'is_verified' => fake()->boolean(80), 
            'password' => Hash::make('password'),
        ];
    }
}