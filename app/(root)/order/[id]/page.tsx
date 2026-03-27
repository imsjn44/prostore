import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/actions/order.actions";
import { ShippingAddress } from "@/.next/types";
import OrderDetailsForm from "./order-details-form";
const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const params = await props.params;

  const { id } = params;

  const order = await getOrderById(id);
  console.log(typeof order?.itemsPrice);
  if (!order) notFound();
  console.log(order);

  return (
    <OrderDetailsForm
      order={
        {
          ...order,

          shippingAddress: order.shippingAddress as ShippingAddress,
        } as any
      }
    />
  );
};

export default OrderDetailsPage;
