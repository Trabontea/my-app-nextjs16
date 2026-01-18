'use server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { productSchema } from './product-validations';
import { db } from '@/db';
import { products } from '@/db/schema';
import z from 'zod';

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
        message: 'You must be signed in to  submit a product',
      };
    }

    if (!orgId) {
      return {
        success: false,
        message: 'You must be a member of an organization to submit a product',
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
