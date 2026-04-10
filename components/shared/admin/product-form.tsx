"use client";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import { UploadButton } from "@/lib/uploadthing";
import { SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validator";
import { ControllerRenderProps } from "react-hook-form";
import { Product } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === "Update"
        ? zodResolver(updateProductSchema)
        : (zodResolver(insertProductSchema) as any),
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });

  // Handle form submit
  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values,
  ) => {
    if (type === "Create") {
      const res = await createProduct(values);

      if (!res.success) {
        toast.error("Ubale to create product", {
          description: res.message,
        });
      } else {
        toast.success("Product created successfully!", {
          description: res.message,
        });
        router.push(`/admin/products`);
      }
    }
    if (type === "Update") {
      if (!productId) {
        router.push(`/admin/products`);
        return;
      }

      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast.error("Unable to update product", {
          description: res.message,
        });
      } else {
        router.push(`/admin/products`);
      }
    }
  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");
  return (
    <form
      id="form-rhf-demo"
      onSubmit={form.handleSubmit(onSubmit)}
      method="post"
    >
      <FieldGroup className="flex flex-col gap-5 md:flex-row">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">Name</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter product name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">Slug</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter slug here or generate"
                autoComplete="off"
              />
              {/* Generate Button */}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="flex flex-col gap-5 md:flex-row my-5">
        <Controller
          name="category"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">Category</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter category here"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="brand"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">Brand</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter brand here"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup className="flex flex-col gap-5 md:flex-row my-5">
        <Controller
          name="price"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">Price</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter price here"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="stock"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">Stock</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter stuck available"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="flex flex-col gap-5 md:flex-row">
        <Controller
          name="images"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-description">Image</FieldLabel>

              <div className="flex-start space-x-2">
                {images.map((image: string) => (
                  <Image
                    key={image}
                    src={image}
                    alt="product image"
                    className="w-20 h-20 object-cover object-center rounded-sm"
                    width={100}
                    height={100}
                  />
                ))}

                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 min-h-[100px] min-w-[150px]">
                  <UploadButton
                    className="upload-field"
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      form.setValue("images", [...images, res[0].url]);
                    }}
                    onUploadError={(error: Error) => {
                      toast("Error uploading image", {
                        description: `ERROR! ${error.message}`,
                      });
                    }}
                  />
                </div>
              </div>

              <FieldDescription></FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="flex flex-col gap-5 md:flex-row">
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-description">
                Description
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="form-rhf-demo-description"
                  placeholder="Description here"
                  rows={6}
                  className="min-h-15 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length}/50 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription></FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <div className="upload-field text-bold text-xs">
          Featured Product
          <Controller
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <div className="flex flex-row gap-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldLabel>Is Featured?</FieldLabel>
              </div>
            )}
          />
          {isFeatured && banner && (
            <Image
              src={banner}
              alt="banner image"
              className=" w-full object-cover object-center rounded-sm"
              width={1920}
              height={680}
            />
          )}
          {isFeatured && !banner && (
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res: { url: string }[]) => {
                form.setValue("banner", res[0].url);
              }}
              onUploadError={(error: Error) => {
                toast("Error uploading image", {
                  description: `ERROR! ${error.message}`,
                });
              }}
            />
          )}
        </div>
      </FieldGroup>

      <Button className="my-2" type="submit" form="form-rhf-demo">
        {form.formState.isSubmitting ? "Submitting" : `${type} Product`}
      </Button>
    </form>
  );
};

export default ProductForm;
