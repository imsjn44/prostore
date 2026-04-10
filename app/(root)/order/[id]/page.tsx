import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/actions/order.actions";
import { ShippingAddress } from "@/lib/constants";
import OrderDetailsForm from "./order-details-form";
import { auth } from "@/auth";
const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const session = await auth();
  const params = await props.params;

  const { id } = params;

  const order = await getOrderById(id);
  console.log(typeof order?.itemsPrice);
  if (!order) notFound();
  // console.log(order);

  return (
    <OrderDetailsForm
      order={{
        ...order,
        itemsPrice: order.itemsPrice.toString(),
        shippingPrice: order.shippingPrice.toString(),
        taxPrice: order.taxPrice.toString(),
        totalPrice: order.totalPrice.toString(),
        orderItems: order.orderItems.map((item: any) => ({
          ...item,
          price: item.price.toString(),
        })),

        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      isAdmin={session?.user?.role === "admin" || false}
    />
  );
};

export default OrderDetailsPage;
