// Data-access helpers for product listings.
// Import the database client and schema from the app, and query helpers from Drizzle ORM.
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { connection } from 'next/server';

/**
 * Fetch all products that are approved.
 * Uses Drizzle ORM to build and run a SELECT query on the `products` table
 * filtering by `status === 'approved'`.
 */
export async function getFeaturedProducts() {
  'use cache';
  // Build the query: SELECT * FROM products WHERE status = 'approved'
  const productsData = await db
    .select()
    .from(products)
    .where(eq(products.status, 'approved'));

  return productsData;
}

export async function getAllProducts() {
  'use cache';
  const productsData = await db
    .select()
    .from(products)
    .orderBy(desc(products.voteCount));

  return productsData;
}

/**
 * Get approved products launched within the last 7 days.
 * Calls `getFeaturedProducts()` first, then filters in memory by `createdAt`.
 */

// connection function allows you to indicate rendering should wait for an incoming user request before continuing.
export async function getRecentlyLaunchedProducts() {
  await connection();
  const productsData = await getAllProducts();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return productsData.filter(
    (product) =>
      // Ensure the product has a creation date, then normalize and compare.
      // The `toISOString()` + `new Date(...)` step normalizes the date for reliable comparison.
      product.createdAt &&
      new Date(product.createdAt.toISOString()) >= oneWeekAgo
  );
}
