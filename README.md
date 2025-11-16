# CraveCozy - Fashion E-Commerce Website

Next.js based fashion e-commerce website for CraveCozy with admin panel and MySQL database using Prisma ORM.

## Features

- 🛍️ Product listing page with beautiful design
- 👨‍💼 Admin panel to add, edit, and delete products
- 🗄️ MySQL database with Prisma ORM
- 🎨 Poppins font for modern typography
- 📱 Responsive design with Tailwind CSS

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Create a `.env` file in the root directory with your MySQL database credentials:

```env
DATABASE_URL="mysql://username:password@localhost:3306/fashion_ecommerce"
```

Replace `username`, `password`, `localhost`, `3306`, and `fashion_ecommerce` with your actual MySQL credentials.

### 3. Setup Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init
```

Or if you already have a database:

```bash
# Push schema to database
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cravecozu/
├── app/
│   ├── admin/          # Admin panel pages
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
├── lib/
│   └── db.ts          # Prisma client instance
├── prisma/
│   └── schema.prisma  # Database schema
└── package.json
```

## Usage

1. **View Products**: Visit the home page to see all products
2. **Admin Panel**: Go to `/admin` to manage products
3. **Add Product**: Click "Add New Product" button in admin panel
4. **Edit Product**: Click "Edit" button next to any product
5. **Delete Product**: Click "Delete" button to remove a product

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Prisma ORM
- MySQL
- Tailwind CSS
- Poppins Font

## Database Schema

The `Product` model includes:
- id (auto-increment)
- name (required)
- description (optional)
- price (required, decimal)
- imageUrl (optional)
- category (optional)
- stock (default: 0)
- createdAt
- updatedAt
