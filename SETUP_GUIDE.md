# BussninesIdea E-Commerce Platform - Setup Guide

## Project Overview

**BussninesIdea** is a modern boutique e-commerce platform built with:
- **Backend**: Laravel 12 + PHP 8.4
- **Frontend**: React 19 + Inertia.js v2
- **Database**: PostgreSQL
- **Development**: Laravel Herd (local server)
- **Testing**: Pest v4

## What's Been Implemented

### ✅ Complete Features

#### Database & Models (7 models)
- **User** - Extended with admin flag and relationships
- **Boutique** - Store/seller management
- **Product** - Product catalog with inventory
- **Category** - Hierarchical product categories
- **Order** - Order tracking with multiple status
- **OrderItem** - Individual items in orders
- **Rating** - Customer reviews and ratings

#### Controllers (7 controllers)
- **ProductController** - CRUD operations for products
- **BoutiqueController** - Boutique management
- **CartController** - Shopping cart operations
- **OrderController** - Order processing
- **RatingController** - Product reviews
- **AdminController** - Admin dashboard & management
- **All with proper authorization checks**

#### Routes (30+ routes)
- Product listing, search, and details
- Boutique browsing and management
- Shopping cart (add, update, remove, clear)
- Order checkout and history
- Rating/review system
- Admin panel with user, boutique, product, order management

#### Authorization Policies (3 policies)
- **BoutiquePolicy** - Control boutique access
- **ProductPolicy** - Control product access
- **OrderPolicy** - Control order visibility

#### Services
- **ShippingService** - Intelligent shipping calculation
  - 1-2 items: 300 den
  - 3+ items: FREE
  - 18% VAT tax included

#### Inertia Pages (Built)
- `Products/Index.tsx` - Product listing with filters
- `Products/Show.tsx` - Product details with reviews
- `Cart/Index.tsx` - Shopping cart
- `Checkout/Create.tsx` - Checkout form
- `Orders/Index.tsx` - Order history
- `Orders/Show.tsx` - Order details

#### Database Seeders (4 seeders)
- **DatabaseSeeder** - Main seeder setup
- **CategorySeeder** - Sample categories (Men, Women, Accessories)
- **BoutiqueSeeder** - 3 sample boutiques
- **ProductSeeder** - 6 products per boutique

#### Tests (3 test files)
- **ProductTest.php** - 6 comprehensive product tests
- **BoutiqueTest.php** - 6 boutique management tests
- **OrderTest.php** - 7 order and shipping tests

---

## Setup Instructions

### 1. Database Setup

First, ensure PostgreSQL is running and create a new database:

```bash
# Create database
createdb businessidea

# Or via PostgreSQL CLI
psql -U postgres
CREATE DATABASE businessidea;
\q
```

### 2. Run Migrations

```bash
cd BussninesIdea

# Run all migrations
php artisan migrate

# Or with fresh database (use with caution!)
php artisan migrate:fresh
```

**Migrations created:**
- `create_boutiques_table`
- `create_categories_table`
- `create_products_table`
- `create_orders_table`
- `create_order_items_table`
- `create_ratings_table`
- `add_is_admin_to_users_table`

### 3. Seed Sample Data

```bash
# Seed the database with sample data
php artisan db:seed

# Or seed fresh database
php artisan migrate:fresh --seed
```

**Seeded data:**
- 1 admin user (`admin@example.com`)
- 5 regular users
- 3 boutique stores
- 18 sample products (6 per boutique)
- 3 product categories

### 4. Start Development Server

```bash
# Terminal 1: Start Laravel
composer run dev

# Terminal 2: Build frontend (if needed)
npm run dev
```

Access at: `https://businessidea.test` (via Laravel Herd)

---

## Key File Locations

### Models
```
app/Models/
├── User.php          (Updated with relationships)
├── Boutique.php      (New)
├── Product.php       (New)
├── Category.php      (New)
├── Order.php         (New)
├── OrderItem.php     (New)
└── Rating.php        (New)
```

### Controllers
```
app/Http/Controllers/
├── ProductController.php   (New)
├── BoutiqueController.php  (New)
├── CartController.php      (New)
├── OrderController.php     (New)
├── RatingController.php    (New)
└── AdminController.php     (New)
```

### Migrations
```
database/migrations/
├── 2025_11_16_120000_create_boutiques_table.php
├── 2025_11_16_120100_create_categories_table.php
├── 2025_11_16_120200_create_products_table.php
├── 2025_11_16_120300_create_orders_table.php
├── 2025_11_16_120400_create_order_items_table.php
├── 2025_11_16_120500_create_ratings_table.php
└── 2025_11_16_120600_add_is_admin_to_users_table.php
```

### Inertia Pages
```
resources/js/pages/
├── Products/
│   ├── Index.tsx   (New)
│   └── Show.tsx    (New)
├── Cart/
│   └── Index.tsx   (New)
├── Checkout/
│   └── Create.tsx  (New)
└── Orders/
    ├── Index.tsx   (New)
    └── Show.tsx    (New)
```

### Routes
```
routes/web.php  (Updated with all e-commerce routes)
```

---

## Testing

### Run All Tests
```bash
php artisan test
```

### Run Specific Test File
```bash
php artisan test tests/Feature/Products/ProductTest.php
php artisan test tests/Feature/Boutiques/BoutiqueTest.php
php artisan test tests/Feature/Orders/OrderTest.php
```

### Run Tests with Filter
```bash
php artisan test --filter=ProductTest
php artisan test --filter=can_view_all_products
```

**Test Coverage:**
- ✅ Product CRUD operations
- ✅ Product authorization
- ✅ Boutique management
- ✅ Order processing
- ✅ Shipping calculations
- ✅ Authorization policies

---

## Key Features Summary

### User Roles
1. **Customer** - Browse and purchase products
2. **Boutique Owner** - Create and manage own boutique + products
3. **Admin** - Manage all users, boutiques, products, orders

### Shopping Features
- ✅ Product browsing with search and filters
- ✅ Shopping cart with session storage
- ✅ Intelligent shipping calculation
- ✅ Multiple payment methods (COD, Stripe, PayPal)
- ✅ Order tracking with 6 status levels
- ✅ Customer product ratings and reviews

### Boutique Features
- ✅ Create and manage boutiques
- ✅ Upload store logos and banners
- ✅ Product management
- ✅ View orders for own products
- ✅ Dashboard with stats

### Admin Features
- ✅ Admin dashboard with KPIs
- ✅ User management (toggle admin status)
- ✅ Boutique moderation (activate/deactivate)
- ✅ Product management
- ✅ Order status management

---

## API Endpoints

### Public Routes
```
GET  /products                    - List all products
GET  /products/{id}               - View product details
GET  /boutiques                   - List all boutiques
GET  /boutiques/{id}              - View boutique
GET  /cart                        - View shopping cart
```

### Authenticated Routes
```
POST /products                    - Create product
PATCH /products/{id}              - Update product
DELETE /products/{id}             - Delete product

POST /boutiques                   - Create boutique
PATCH /boutiques/{id}             - Update boutique
DELETE /boutiques/{id}            - Delete boutique
GET  /my-boutiques                - View my boutiques

POST /cart/add                    - Add to cart
PATCH /cart/{id}                  - Update cart item
DELETE /cart/{id}                 - Remove from cart
DELETE /cart                      - Clear cart

POST /checkout                    - Create order
GET  /orders                      - View my orders
GET  /orders/{id}                 - View order details

POST /products/{id}/rate          - Add review
DELETE /ratings/{id}              - Delete review
```

### Admin Routes (Requires is_admin = true)
```
GET    /admin/dashboard           - Admin dashboard
GET    /admin/users               - List users
PATCH  /admin/users/{id}/toggle   - Toggle admin status
GET    /admin/boutiques           - List boutiques
PATCH  /admin/boutiques/{id}      - Toggle boutique status
GET    /admin/products            - List all products
GET    /admin/orders              - List all orders
PATCH  /admin/orders/{id}/status  - Update order status
```

---

## Environment Configuration

### .env Settings (PostgreSQL)
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=businessidea
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### File Storage
```env
FILESYSTEM_DISK=public
```

Images are stored in `storage/app/public/`:
- Products: `products/`
- Boutiques: `boutiques/logos/`, `boutiques/banners/`

---

## Payment Integration (TODO)

Payment processing is stubbed but not fully implemented. To complete:

### For Stripe Integration
1. Install Stripe PHP SDK: `composer require stripe/stripe-php`
2. Add Stripe keys to `.env`
3. Implement payment processing in `OrderController@checkout`

### For PayPal Integration
1. Install PayPal SDK: `composer require paypal/checkout-sdk-php`
2. Add PayPal credentials to `.env`
3. Implement payment processing

### For COD (Cash on Delivery)
- Already supports creating orders with COD payment method
- Mark as "pending" until admin confirms

---

## Common Commands

```bash
# Database
php artisan migrate                 # Run migrations
php artisan migrate:fresh           # Reset and migrate
php artisan migrate:fresh --seed    # Reset, migrate, and seed
php artisan db:seed                 # Run seeders only

# Development
composer run dev                    # Start dev server
npm run dev                         # Build frontend
npm run build                       # Production build

# Code Quality
vendor/bin/pint                     # Format code
vendor/bin/pint --dirty             # Format changed files
npm run lint                        # Lint JavaScript

# Testing
php artisan test                    # Run all tests
php artisan test tests/Feature/     # Run feature tests only

# Tinker
php artisan tinker                  # Interactive shell
>>> User::all()                     # Run code
```

---

## Troubleshooting

### Page Not Found (404)
- Ensure migrations have run: `php artisan migrate`
- Clear route cache: `php artisan route:clear`
- Ensure Herd is running properly

### Database Connection Error
- Check PostgreSQL is running
- Verify `.env` database credentials
- Ensure database exists: `createdb businessidea`

### Asset Issues
- Run `npm run build`
- Clear cache: `php artisan cache:clear`
- Run `npm install` if dependencies missing

### Middleware Issues
- Ensure `IsAdmin` middleware is registered in `bootstrap/app.php`
- Check route middleware groups

---

## Next Steps

1. **Complete Payment Integration** - Implement Stripe/PayPal processing
2. **Email Notifications** - Send order confirmation emails
3. **Advanced Search** - Add full-text search for products
4. **Analytics** - Track product views, sales trends
5. **Reviews Moderation** - Admin approval for reviews
6. **Wishlist Feature** - Save favorite products
7. **Recommendations** - ML-based product recommendations

---

## Support & Documentation

For detailed information on technologies used:
- [Laravel 12 Docs](https://laravel.com/docs/12.x)
- [Inertia.js Docs](https://inertiajs.com)
- [Pest Testing Docs](https://pestphp.com)
- [React Docs](https://react.dev)

---

**Last Updated**: 2025-11-16
**Project Status**: ✅ Core Features Complete - Ready for Payment Integration & Deployment
