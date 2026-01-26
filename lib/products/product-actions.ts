'use server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { productSchema } from './product-validations';
import { db } from '@/db';
import { products } from '@/db/schema';
import z from 'zod';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

type FormState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message: string;
};

// Server Action - submitting the product
// step create the product in the table

export const addProductAction = async (
  prevState: FormState,
  formData: FormData,
) => {
  console.log('formData', formData);

  try {
    //check if the user is authenticated
    // in the case of organization Id => orgId
    const { userId, orgId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: 'You must be signed in to submit a product',
        errors: undefined,
      };
    }

    if (!orgId) {
      return {
        success: false,
        message: 'You must be a member of an organization to submit a product',
        errors: undefined,
      };
    }

    // Get the user Email
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress || 'anonymous';

    // extract the data from formData
    const rawFormData = Object.fromEntries(formData.entries());

    // validate the data with Zod library
    const validatedData = productSchema.safeParse(rawFormData);

    if (!validatedData.success) {
      console.log(validatedData.error.flatten().fieldErrors);
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: 'Invalid data ',
      };
    }

    // transform the data for our request
    const { name, slug, tagline, description, websiteUrl, tags } =
      validatedData.data;

    const tagsArray = tags ? tags.filter((tag) => typeof tag === 'string') : [];

    // create with insert the product in the table
    await db.insert(products).values({
      name,
      slug,
      tagline,
      description,
      websiteUrl,
      tags: tagsArray,
      status: 'pending',
      submittedBy: userEmail,
      organizationId: orgId || '', // organisation is set in Clerck / Db
      userId,
    });

    return {
      success: true,
      message: 'Product submitted successfully.It will be reviews shortly',
    };
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
        message: 'Validation failed. Please check the form.',
      };
    }
    return {
      success: true,
      errors: error,
      message: 'Failed to submit product',
    };
  }
};

/**
 * Server Action - Upvote a product
 * Increments the vote count for a specific product by 1
 * @param productId - The ID of the product to upvote
 * @returns Object with success status and message
 */
export const upvoteProductAction = async (productId: number) => {
  try {
    // Get the authenticated user's ID and organization ID
    const { userId, orgId } = await auth();

    // Check if user is authenticated
    if (!userId) {
      console.log('User not signed in');
      return {
        success: false,
        message: 'You must be signed in to submit a product',
      };
    }

    // Check if user belongs to an organization
    if (!orgId) {
      console.log('User not a member of an organization');
      return {
        success: false,
        message: 'You must be a member of an organization to submit a product',
      };
    }

    // Update the product's vote count in the database
    // Use GREATEST to ensure vote count never goes below 0
    await db
      .update(products)
      .set({
        voteCount: sql`GREATEST(0, vote_count + 1)`,
      })
      .where(eq(products.id, productId));

    // Revalidate the home page cache to show updated vote count
    revalidatePath('/');

    return {
      success: true,
      message: 'Product upvoted successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to upvote product',
      voteCount: 0,
    };
  }
};

/**
 * Server Action - Downvote a product
 * Decrements the vote count for a specific product by 1
 * @param productId - The ID of the product to downvote
 * @returns Object with success status and message
 */
export const downvoteProductAction = async (productId: number) => {
  try {
    // Get the authenticated user's ID and organization ID
    const { userId, orgId } = await auth();

    // Check if user is authenticated
    if (!userId) {
      console.log('User not signed in');
      return {
        success: false,
        message: 'You must be signed in to submit a product',
      };
    }

    // Check if user belongs to an organization
    if (!orgId) {
      console.log('User not a member of an organization');
      return {
        success: false,
        message: 'You must be a member of an organization to submit a product',
      };
    }

    // Update the product's vote count in the database
    // Use GREATEST to ensure vote count never goes below 0
    await db
      .update(products)
      .set({
        voteCount: sql`GREATEST(0, vote_count - 1)`,
      })
      .where(eq(products.id, productId));

    // Revalidate the home page cache to show updated vote count
    revalidatePath('/');

    return {
      success: true,
      message: 'Product downvoted successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to downvote product',
      voteCount: 0,
    };
  }
};
