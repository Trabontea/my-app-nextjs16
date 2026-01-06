// 'use cache';
import SectionHeader from '@/components/common/section-header';
import { ArrowUpRightIcon, StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProductCard from '@/components/products/product-card';
// import { getFeaturedProducts } from '@/lib/products/product-select';

const featuredProducts = [
  {
    id: 1,
    name: 'PaityKit',
    description: 'A toolkit for creating parity products',
    slug: 'paitykit',
    tags: ['Saas', 'Pricing'],
    votes: 615,
    isFeatured: true,
  },
  {
    id: 2,
    name: 'Nextjs Course',
    description: 'Nextjs Course Web Fullstack',
    link: 'https://via.placeholder.150',
    slug: 'nextjs-course',
    tags: ['NextJS', 'Modern', 'Product'],
    votes: 1500,
    isFeatured: false,
  },
];

export default async function FeaturedProducts() {
  // const featuredProducts = await getFeaturedProducts();
  return (
    <section className="py-20 bg-muted/20">
      <div className="wrapper">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader
            title="Featured Today"
            icon={StarIcon}
            description="Top picks from our community this week"
          />
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/explore">
              View All <ArrowUpRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid-wrapper">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
