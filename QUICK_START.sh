#!/bin/bash

# BussninesIdea E-Commerce Platform - Quick Start Script
# Run this script to set up your project quickly!

echo "╔═══════════════════════════════════════════════════╗"
echo "║  BussninesIdea E-Commerce Platform - Quick Start  ║"
echo "║  Fortune Boutiques: Every Boutique. One Place.    ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Step 1: Create Database
echo "📦 Step 1: Creating PostgreSQL Database..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
createdb businessidea 2>/dev/null || echo "✓ Database exists or created"
echo ""

# Step 2: Install Dependencies
echo "📚 Step 2: Installing PHP Dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
composer install
echo ""

# Step 3: Environment Setup
echo "⚙️  Step 3: Setting Up Environment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ .env file created from .env.example"
fi

# Generate app key
php artisan key:generate --force
echo ""

# Step 4: Database Migrations
echo "🗄️  Step 4: Running Database Migrations..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
php artisan migrate:fresh
echo ""

# Step 5: Database Seeding
echo "🌱 Step 5: Seeding Sample Data..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
php artisan db:seed
echo ""

# Step 6: Install Node Dependencies
echo "📦 Step 6: Installing Node Dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm install
echo ""

# Step 7: Build Frontend
echo "🔨 Step 7: Building Frontend Assets..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run build
echo ""

# Step 8: Storage Link
echo "🔗 Step 8: Creating Storage Link..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
php artisan storage:link 2>/dev/null || echo "✓ Storage link exists"
echo ""

# Step 9: Run Tests
echo "✅ Step 9: Running Tests..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
php artisan test --pest
echo ""

# Success Message
echo "╔═══════════════════════════════════════════════════╗"
echo "║  ✅ Setup Complete!                              ║"
echo "╠═══════════════════════════════════════════════════╣"
echo "║  📝 Default Credentials:                          ║"
echo "║  Admin Email:    admin@example.com                ║"
echo "║  Admin Password: password                         ║"
echo "║                                                   ║"
echo "║  Customer Email: test@example.com                 ║"
echo "║  Password:       password                         ║"
echo "╠═══════════════════════════════════════════════════╣"
echo "║  🚀 Next Steps:                                   ║"
echo "║  1. Run development server:                       ║"
echo "║     composer run dev                              ║"
echo "║                                                   ║"
echo "║  2. In another terminal, build frontend:          ║"
echo "║     npm run dev                                   ║"
echo "║                                                   ║"
echo "║  3. Open in browser:                              ║"
echo "║     https://businessidea.test                     ║"
echo "║                                                   ║"
echo "║  📚 Documentation:                                ║"
echo "║  - SETUP_GUIDE.md       - Detailed setup          ║"
echo "║  - IMPLEMENTATION_SUMMARY.md - What was built     ║"
echo "╚═══════════════════════════════════════════════════╝"
