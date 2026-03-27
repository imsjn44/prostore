import { formatId } from "@/lib/utils";
import { Order } from "@/.next/types";

const OrderDetailsForm = ({ order }: { order: Order }) => {
  return (
    <>
      <h1 className="py-4 text-2xl"> Order {formatId(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="overflow-x-auto md:col-span-2 space-y-4">Content</div>
      </div>
    </>
  );
};

export default OrderDetailsForm;
