import { getFeaturedProducts } from '@/lib/products/product-select';

// generateStaticParams is a Next.js 13+ function that generates static paths at build time
// for dynamic route segments (like [slug]). This enables Static Site Generation (SSG).
export const generateStaticParams = async () => {
  // Fetch all featured products from the database or API
  const products = await getFeaturedProducts();

  // Map each product to an object containing the slug parameter
  // Next.js will pre-render a page for each slug at build time
  return products.map((product) => ({
    slug: product.slug.toString(), // Convert slug to string for the URL parameter
  }));
};

const PageDetail = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return <div>Detail page {slug}</div>;
};

export default PageDetail;
