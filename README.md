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
- **Language Composition**: TypeScript (93.7%), JavaScript (3.5%), TailwindCSS (2.8%)

## Screenshots

### Homepage
<p>
  <img width="1871" height="873" alt="Screenshot 2026-05-26 200402" src="https://github.com/user-attachments/assets/697d2951-c9e3-4af7-84f2-6cd71d90eef6" />

</p>
### Product Catalog
<p>
  <img width="1860" height="871" alt="Screenshot 2026-05-26 200426" src="https://github.com/user-attachments/assets/68566435-aec0-4673-ad12-34da083d5fa5" />

</p>

### Shopping Cart
<p>
  <img width="1900" height="411" alt="Screenshot 2026-05-26 200502" src="https://github.com/user-attachments/assets/3d0b2108-515c-4c42-a7be-b7d219886e01" />

</p>

### Shipping Address

<p>
  <img width="1907" height="753" alt="Screenshot 2026-05-26 200517" src="https://github.com/user-attachments/assets/8b9b48f3-9e8c-40c7-b944-af459872ef29" />
</p>

###  Choose Payment Method
<p>
  <img width="1915" height="593" alt="Screenshot 2026-05-26 200601" src="https://github.com/user-attachments/assets/6e3f58c9-fd09-4fd8-8386-bf8402c0f3f4" />
</p>


### Place Order
<p>
  <img width="1877" height="840" alt="Screenshot 2026-05-26 200635" src="https://github.com/user-attachments/assets/cb2db621-55cd-40b4-bd92-15c6db2aa90b" />

</p>


###Pay with eSewa

<p>

<img width="1866" height="853" alt="Screenshot 2026-05-26 200655" src="https://github.com/user-attachments/assets/a2760844-4ff6-41ef-aec5-4c2a18cc4a7e" />
  <img width="558" height="386" alt="Screenshot 2026-05-26 200706" src="https://github.com/user-attachments/assets/2c6cf3fe-5b81-4faa-9d9c-38ec559f1433" />
<img width="1868" height="861" alt="Screenshot 2026-05-26 200721" src="https://github.com/user-attachments/assets/cfec9232-d6de-4c7f-a508-17c723fd71fd" />
<img width="1262" height="687" alt="Screenshot 2026-05-26 200909" src="https://github.com/user-attachments/assets/612826d2-9fa0-4a12-9907-59a2b2892b17" />
<img width="772" height="570" alt="Screenshot 2026-05-26 200934" src="https://github.com/user-attachments/assets/d26c1f50-4086-4542-a9fa-1d1cc5c31cfc" />

</p>

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
NEXT_PUBLIC_APP_NAME="Prostore"
NEXT_PUBLIC_APP_DESCRIPTION="Prostore is a modern e-commerce platform for selling digital products"
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
DATABASE_URL="postgresql://neondb_owner
LATEST_PRODUCTS_LIMIT="6"
NEXTAUTH_SECRET=
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_URL_INTERNAL="http://localhost:3000"
PAYMENT_METHODS="Esewa,Stripe,CashOnDelivery"
DEFAULT_PAYMENT_METHOD=
NEXT_PUBLIC_ESEWA_MERCHANT_CODE="EPAYTEST"
NEXT_PUBLIC_ESEWA_SECRET_KEY="8gBm/:&EnhH.1/q"
ESEWA_VERIFY_URL="https://rc-epay.esewa.com.np/api/epay/transaction/status/"
# Not available so Khalti integration stopped here just needed this
KHALTI_PUBLIC_KEY=
KHALTI_SECRET_KEY=

UPLOADTHING_TOKEN=
UPLOADTHING_SECRET=sk_live
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
