'use cache';

import SectionHeader from '@/components/common/section-header';
import VotingButtons from '@/components/products/voting-buttons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  getFeaturedProducts,
  getProductBySlug,
} from '@/lib/products/product-select';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ExternalLinkIcon,
  StarIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
  // Extract the slug parameter from the dynamic route
  const { slug } = await params;

  // Fetch the product data from the database using the slug
  const product = await getProductBySlug(slug);

  // Destructure product properties for easier access throughout the component
  const { name, description, websiteUrl, tags, voteCount, tagline } = product;

  // If no product is found with the given slug, show the 404 page
  if (!product) {
    notFound();
  }

  return (
    <div className="py-16">
      <div className="wrapper">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeftIcon className="size-4" /> Back to Explore
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-6">
              <div className="flex-1 min-w-0">
                <div className="mb-6">
                  <SectionHeader
                    title={name}
                    icon={StarIcon}
                    description={tagline ?? ''}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-primary/10">
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>

              <div className="space-y-3">
                {[
                  {
                    label: 'Launched:',
                    value: new Date(
                      product.createdAt?.toISOString() ?? '',
                    ).toLocaleDateString('Ro'),
                    icon: CalendarIcon,
                  },
                  {
                    label: 'Submitted by:',
                    value: product.submittedBy,
                    icon: UserIcon,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    {Icon && <Icon className="size-4 text-muted-foreground" />}
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="border rounded-lg p-6 bg-background">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    Support this product
                  </p>
                  <VotingButtons productId={product.id} voteCount={voteCount} />
                </div>
                {voteCount > 100 && (
                  <div className="pt-6 border-t">
                    <Badge className="w-full justify-center py-2">
                      🔥 Featured Product
                    </Badge>
                  </div>
                )}
              </div>
              {websiteUrl && (
                <Button
                  asChild
                  className="w-full rounded-lg"
                  variant={'outline'}
                >
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website <ExternalLinkIcon className="size-4 ml-2" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDetail;
