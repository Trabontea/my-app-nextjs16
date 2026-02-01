'use client';

import { ClockIcon, SearchIcon, TrendingUpIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/products/product-card';
import { ProductType } from '@/types';
import { useMemo, useState } from 'react';

export default function ProductExplorer({
  products,
}: {
  products: ProductType[];
}) {
  // State for sorting option: trending (by votes), recent, or newest (by creation date)
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'newest'>(
    'trending',
  );
  // State for search query to filter products by name
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized filtered and sorted products list to optimize performance
  // Recalculates only when searchQuery, products, or sortBy changes
  const filteredProducts = useMemo(() => {
    // Create a copy of the products array to avoid mutating the original
    const filtered = [...products];

    // If there's a search query, filter products by name (case-insensitive)
    if (searchQuery.length > 0) {
      return filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort products based on the selected sorting option
    switch (sortBy) {
      case 'trending':
        // Sort by vote count in descending order (highest votes first)
        return filtered.sort((a, b) => b.voteCount - a.voteCount);

      case 'recent':
        // Sort by creation date in descending order (most recent first)
        return filtered.sort(
          (a, b) =>
            new Date(b.createdAt || '').getTime() -
            new Date(a.createdAt || '').getTime(),
        );

      case 'newest':
        // Sort by creation date in descending order (newest first)
        return filtered.sort(
          (a, b) =>
            new Date(b.createdAt || '').getTime() -
            new Date(a.createdAt || '').getTime(),
        );
      default:
        return filtered;
    }
  }, [searchQuery, products, sortBy]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={sortBy === 'trending' ? 'default' : 'outline'}
            onClick={() => setSortBy('trending')}
          >
            <TrendingUpIcon className="size-4" />
            Trending
          </Button>
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            onClick={() => setSortBy('recent')}
          >
            <ClockIcon className="size-4" />
            Recent
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} products
        </p>
      </div>

      <div className="grid-wrapper">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
