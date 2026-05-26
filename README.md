# ProStore

A modern ecommerce store built using **Next.js**, **PostgreSQL**, **Prisma**, and **TypeScript**.

## Features

- 🛍️ Modern, responsive ecommerce interface
- 🔐 Secure user authentication and authorization
- 💳 Product catalog with filtering and search
- 🛒 Shopping cart functionality
- 📦 Order management system
- 💾 PostgreSQL database with Prisma ORM
- ⚡ Next.js App Router for optimal performance
- 🎨 TypeScript for type safety

## Tech Stack

- **Frontend**: Next.js 14+, React, TypeScript, CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Language Composition**: TypeScript (93.7%), JavaScript (3.5%), CSS (2.8%)

## Screenshots

Add your screenshots here to showcase the application:

### Homepage
![Homepage](./public/screenshots/homepage.png)

### Product Catalog
![Product Catalog](./public/screenshots/product-catalog.png)

### Shopping Cart
![Shopping Cart](./public/screenshots/shopping-cart.png)

### Checkout
![Checkout](./public/screenshots/checkout.png)

### Order Confirmation
![Order Confirmation](./public/screenshots/order-confirmation.png)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/imsjn44/prostore.git
cd prostore
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/prostore"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio to view database

## Project Structure

```
prostore/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── products/          # Products pages
│   ├── cart/              # Cart pages
│   └── orders/            # Orders pages
├── components/            # Reusable React components
├── lib/                   # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                # Static files
└── styles/                # Global styles
```

## Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User** - Store user account information
- **Product** - Ecommerce product listings
- **Cart** - Shopping cart items
- **Order** - Customer orders
- **OrderItem** - Individual items in orders

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Traditional Server

1. Build the application:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues, questions, or suggestions, please open a GitHub issue in the repository.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ by [imsjn44](https://github.com/imsjn44)**
