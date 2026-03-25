import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.actions";
import Link from "next/link";

export const metadata = {
  title: "Shopping Cart",
};

const CartPage = async () => {
  const cart = await getMyCart();
  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3"></div>
        </div>
      )}
      <CartTable cart={cart} />
    </>
  );
};

export default CartPage;
