import { prisma } from "@/db/prisma";
import { convertToJSObject } from "../utils";
import * as dotenv from "dotenv";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
dotenv.config();

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  return convertToJSObject(data);
}
