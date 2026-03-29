"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { formatError } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";

export default function KhaltiPayment() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [amount, setAmount] = useState("");
  const [productName, setProductName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return;

      try {
        const response = await fetch(`/api/autofilldata/${orderId}`);
        if (!response.ok) throw new Error("Failed to fetch order data");

        const data = await response.json();

        // Ensure we are setting strings for the input fields
        setAmount(data.totalPrice.toString());
        setProductName(data.productName);
        setTransactionId(data.orderId);

        toast.success("Order data loaded");
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load order details.");
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Convert NPR to Paisa (Integer)
      const amountInPaisa = Math.round(parseFloat(amount) * 100);

      if (isNaN(amountInPaisa) || amountInPaisa <= 0) {
        throw new Error("Invalid amount");
      }

      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "khalti",
          amount: amountInPaisa, // Sending as integer paisa
          purchase_order_id: transactionId, // Use Khalti's expected naming
          purchase_order_name: productName,
          return_url: `${window.location.origin}/api/payment-verify`, // Standard return path
          website_url: window.location.origin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment initiation failed");
      }

      if (data.khaltiPaymentUrl) {
        // Redirect to Khalti's hosted payment page
        window.location.href = data.khaltiPaymentUrl;
      } else {
        throw new Error("No payment URL received from server");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Khalti Payment</CardTitle>
          <CardDescription>Review your order details</CardDescription>
        </CardHeader>
        <form onSubmit={handlePayment}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (NPR)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionId">Order ID</Label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
                readOnly // Usually you don't want users changing the Order ID
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Redirecting to Khalti..." : "Pay with Khalti"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
