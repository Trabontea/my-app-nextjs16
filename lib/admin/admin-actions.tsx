'use server';

import { db } from '@/db';
import { products } from '@/db/schema';
import { ProductType } from '@/types';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Server action to approve a product
 * Updates the product status to 'approved' and sets the approval timestamp
 * @param productId - The ID of the product to approve
 * @returns Object with success status and message
 */
export const approveProductAction = async (productId: ProductType['id']) => {
  console.log('Approve product', productId);

  try {
    // Update the product in the database
    await db
      .update(products)
      .set({ status: 'approved', approvedAt: new Date() })
      .where(eq(products.id, productId));

    // Revalidate the admin page cache to show updated data
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Product approved successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to approve product',
    };
  }
};

/**
 * Server action to reject a product
 * Updates the product status to 'rejected'
 * @param productId - The ID of the product to reject
 * @returns Object with success status and message
 */
export const rejectProductAction = async (productId: ProductType['id']) => {
  console.log('Reject product', productId);
  try {
    // Update the product status to rejected in the database
    await db
      .update(products)
      .set({ status: 'rejected' })
      .where(eq(products.id, productId));

    // Revalidate the admin page cache to show updated data
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Product rejected successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to reject product',
    };
  }
};

/**
 * Server action to delete a product
 * Permanently removes a product from the database
 * @param productId - The ID of the product to delete
 * @returns Object with success status and message
 */
export const deleteProductAction = async (productId: ProductType['id']) => {
  console.log('Delete product', productId);
  try {
    // Delete the product from the database
    await db.delete(products).where(eq(products.id, productId));

    // Revalidate the admin page cache to show updated data
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to delete product',
    };
  }
};
