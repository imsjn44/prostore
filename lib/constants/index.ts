export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Prostore";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern store built with Next.js";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 6;
export const signUpDefaultValues = {
  name: "Steve Smith",
  email: "steve@example.com",
  password: "password",
  confirmPassword: "password",
};

export const shippingAddressDefaultValues = {
  fullName: "John Doe",
  streetAddress: "123 Main St",
  city: "Anytown",
  postalCode: "12345",
  country: "USA",
};

// export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
//   ? process.env.PAYMENT_METHODS.split(",").map((m) => m.trim())
//   : ["PayPal", "Stripe", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "Esewa";
import { z } from "zod";
import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
} from "@/lib/validator";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  createdAt: Date;
  rating: string;
  numReviews: number;
};
export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
// export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum PaymentMethod {
  ESEWA = "esewa",
  KHALTI = "khalti",
  STRIPE = "stripe",
  CASHONDELIVERY = "cashondelivery",
}
export const PAYMENT_METHODS = [
  PaymentMethod.ESEWA,
  PaymentMethod.KHALTI,
  PaymentMethod.STRIPE,
  PaymentMethod.CASHONDELIVERY,
] as const;

export interface PaymentRequestData {
  amount: string; // Payment amount as string, e.g., "100.00"
  productName: string; // Name of the product or service
  transactionId: string; // Unique transaction/order ID
  method: PaymentMethod; // Payment method: "esewa" or "khalti"
}
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: Boolean;
  paidAt: Date | null;
  isDelivered: Boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: { name: string; email: string };
};
