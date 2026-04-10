"use server";
import { prisma } from "@/db/prisma";
import { convertToJSObject } from "../utils";
import * as dotenv from "dotenv";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
dotenv.config();
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import z from "zod";
import { insertProductSchema, updateProductSchema } from "../validator";

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  return convertToJSObject(data);
}

// Get single product by slug
export async function getProductsBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}

export async function getAllProducts({
  limit = PAGE_SIZE,
  page,
  query,
  category,
}: {
  limit?: number;
  page: number;
  query: string;
  category?: string;
}) {
  const data = await prisma.product.findMany({
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//Delete products
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create Product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    // Validate and create product
    const product = insertProductSchema.parse(data);
    console.log(product);
    await prisma.product.create({ data: product });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update Product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    // Validate and find product
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error("Product not found");

    // Update product
    await prisma.product.update({ where: { id: product.id }, data: product });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get single product by id
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToJSObject(data);
}
