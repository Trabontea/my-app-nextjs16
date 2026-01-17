import { getFeaturedProducts } from '@/lib/products/product-select';

export const generateStaticParams = async () => {
  const products = await getFeaturedProducts();

  return products.map((product) => ({
    id: product.id.toString(),
  }));
};

const PageDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <div>Detail page {id}</div>;
};

export default PageDetail;
