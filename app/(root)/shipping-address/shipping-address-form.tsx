"use client";
import { ShippingAddress } from "@/.next/types";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingAddressSchema } from "@/lib/validator";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { useTransition } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { toast } from "sonner";
import { updateUserAddress } from "@/lib/actions/users.action";
const ShippingAddressForm = ({
  address,
}: {
  address: ShippingAddress | null;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });
  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values: any,
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast(res.message, {
          description: "Error submitting!",
        });
        return;
      }

      router.push("/payment-method");
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter the address that you want to ship to
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <Field>
          <FieldLabel>Full Name</FieldLabel>
          <Input placeholder="Enter full name" {...form.register("fullName")} />
          <FieldError>{form.formState.errors.fullName?.message}</FieldError>
        </Field>

        {/* Street Address */}
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Input
            placeholder="Enter address"
            {...form.register("streetAddress")}
          />
          <FieldError>
            {form.formState.errors.streetAddress?.message}
          </FieldError>
        </Field>

        {/* City, Country, and Postal Code in a Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field>
            <FieldLabel>City</FieldLabel>
            <Input placeholder="City" {...form.register("city")} />
            <FieldError>{form.formState.errors.city?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Country</FieldLabel>
            <Input placeholder="Country" {...form.register("country")} />
            <FieldError>{form.formState.errors.country?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Postal Code</FieldLabel>
            <Input placeholder="Zip" {...form.register("postalCode")} />
            <FieldError>{form.formState.errors.postalCode?.message}</FieldError>
          </Field>
        </div>

        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          {isPending ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          Continue
        </Button>
      </form>
    </div>
  );
};

export default ShippingAddressForm;
