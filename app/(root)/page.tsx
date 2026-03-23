import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";
import { getLatestProducts } from "@/lib/actions/product.actions";

const HomePage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const latestProducts = await getLatestProducts();
  return (
    <div className="space-y-8">
      <h2 className="h2-bold">Latest Products</h2>
      <ProductList title="Newest Arrivals" data={latestProducts} limit={6} />
    </div>
  );
};

export default HomePage;
