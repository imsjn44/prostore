"use client";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/users.action";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { PaymentMethod } from "@/.next/types";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();
  const onSubmit: SubmitHandler<z.infer<typeof paymentMethodSchema>> = async (
    values: PaymentMethod,
  ) => {
    startTransition(async () => {
      console.log(values);
      const res = await updateUserPaymentMethod(values);
      console.log(res);
      if (!res.success) {
        toast(res.message, {
          description: "Error submitting!",
        });
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
            defaultValue={DEFAULT_PAYMENT_METHOD}
            className="flex flex-col gap-2"
          >
            {PAYMENT_METHODS.map((method, index) => (
              <div key={index} className="flex items-center space-x-2 ">
                <RadioGroupItem
                  value={method}
                  className="cursor-pointer"
                  id={`method-${index}`}
                />
                <Label htmlFor={`option-${index}`}>{method}</Label>
              </div>
            ))}
          </RadioGroup>
        </FieldSet>

        <div className="flex gap-2 mt-5 ">
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
