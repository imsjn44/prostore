export const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places (e.g., 49.99)",
  );
import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

// Schema for inserting a product
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Make sure price is formatted with two decimal places

//Schema for signing in form

export const signInFormSchema = z.object({
  email: z
    .string() // The email field must be a string
    .email("Invalid email address") // Must be a valid email format
    .min(3, "Email must be at least 3 characters"), // Minimum length 3
  password: z
    .string() // The password field must be a string
    .min(3, "Password must be at least 3 characters"), // Minimum length 3
});
