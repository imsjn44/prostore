"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react"; // Replaces useFormStatus for manual handling
import { Button } from "@/components/ui/button";
import { Loader, Check } from "lucide-react";
import { createOrder } from "@/lib/actions/order.actions";
import { toast } from "sonner";
const PlaceOrderForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        const res = await createOrder();

        if (res.success && res.redirectTo) {
          router.push(res.redirectTo);
        } else {
          // Handle custom error messages from your action
          toast(res.message || "Failed to place order");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };
  const PlaceOrderButton = () => {
    return (
      <Button disabled={isPending} className="w-full">
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}{" "}
        Place Order
      </Button>
    );
  };
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
