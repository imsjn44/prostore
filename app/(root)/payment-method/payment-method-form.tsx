"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PAYMENT_METHODS } from "@/lib/constants";

import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FieldSet, FieldLegend, FieldDescription } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader, ArrowRight } from "lucide-react";

import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { DEFAULT_PAYMENT_METHOD, PaymentMethod } from "@/lib/constants";
// import { paymentMethodSchema } from "@/lib/validator";

interface PaymentMethodFormProps {
  preferredPaymentMethod: PaymentMethod | null;
}

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: PaymentMethodFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<{ type: PaymentMethod }>({
    defaultValues: {
      type: preferredPaymentMethod || (DEFAULT_PAYMENT_METHOD as PaymentMethod),
    },
  });
  const selectedMethod = form.watch("type");

  const onSubmit: SubmitHandler<{ type: PaymentMethod }> = async (values) => {
    startTransition(async () => {
      console.log("Submitting payment method:", values.type);

      const res = await updateUserPaymentMethod(values.type as PaymentMethod);
      console.log("API RESPONSE:", res); // 👈 ADD THIS
      if (!res.success) {
        toast(res.message, { description: "Error submitting!" });
        return;
      }

      router.push("/place-order");
    });
  };

  return (
    <>
      <CheckoutSteps current={2} />

      <form className="max-w-md mx-auto" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet className="w-full max-w-xs">
          <FieldLegend variant="label">Payment Methods</FieldLegend>
          <FieldDescription>
            Choose your preferred payment method to continue.
          </FieldDescription>

          <RadioGroup
            value={form.watch("type")}
            onValueChange={(val) => form.setValue("type", val as PaymentMethod)}
            className="flex flex-col gap-2"
          >
            {PAYMENT_METHODS.map((method, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={method} id={`method-${index}`} />
                <Label htmlFor={`method-${index}`}>{method}</Label>
              </div>
            ))}
          </RadioGroup>
        </FieldSet>

        <div className="flex gap-2 mt-5">
          <Button className="cursor-pointer" type="submit" disabled={isPending}>
            {isPending ? (
              <Loader className="animate-spin w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            Continue
          </Button>
        </div>
      </form>
    </>
  );
};

export default PaymentMethodForm;
