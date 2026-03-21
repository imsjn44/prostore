import * as dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import sampleData from "./sample-data";

async function main() {
  // 1. Setup the connection pool
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  // 2. Pass the adapter as the required argument
  const prisma = new PrismaClient({ adapter });

  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: sampleData.products });

  console.log("Database seeded successfully");

  // 3. Optional: Close pool when done
  await pool.end();
}

main();
