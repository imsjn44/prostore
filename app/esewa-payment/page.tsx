"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Added this
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatError } from "@/lib/utils";

export default function EsewaPayment() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId"); // Extracts the ID from the URL

  const [amount, setAmount] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return; // Don't fetch if no ID is present

      try {
        // Pass the actual orderId to your backend
        const response = await fetch(`/api/autofilldata/${orderId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // Populate the form with real data from your DB
        setAmount(data.totalPrice);
        setProductName(data.productName);
        setTransactionId(data.orderId); // Using orderId as the unique transaction UUID

        toast.success("Order data loaded");
      } catch (error) {
        console.log("Error fetching data:", formatError(error));
        toast.error("Failed to load order details.");
      }
    };

    fetchOrderData();
  }, [orderId]); // Re-run if orderId changes

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Get the eSewa signature and config from your backend
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "esewa",
          amount,
          productName,
          transactionId, // This must match the transaction_uuid used in the signature
        }),
      });

      if (!response.ok) throw new Error("Payment initiation failed");

      const paymentData = await response.json();

      // 2. Programmatically create and submit the eSewa form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      // eSewa V2 specific fields
      const esewaPayload = {
        amount: paymentData.amount,
        tax_amount: paymentData.esewaConfig.tax_amount,
        total_amount: paymentData.esewaConfig.total_amount,
        transaction_uuid: paymentData.esewaConfig.transaction_uuid,
        product_code: paymentData.esewaConfig.product_code,
        product_service_charge: paymentData.esewaConfig.product_service_charge,
        product_delivery_charge:
          paymentData.esewaConfig.product_delivery_charge,
        success_url: paymentData.esewaConfig.success_url,
        failure_url: paymentData.esewaConfig.failure_url,
        signed_field_names: paymentData.esewaConfig.signed_field_names,
        signature: paymentData.esewaConfig.signature,
      };

      Object.entries(esewaPayload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      toast.error("Payment failed to start. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>eSewa Payment</CardTitle>
          <CardDescription>Review details for Order #{orderId}</CardDescription>
        </CardHeader>
        <form onSubmit={handlePayment}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount (NPR)</Label>
              <Input
                id="amount"
                value={amount}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading || !amount}
            >
              {isLoading ? "Redirecting..." : "Confirm & Pay with eSewa"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
