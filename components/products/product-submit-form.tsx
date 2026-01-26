'use client';
import { Loader2Icon, SparklesIcon } from 'lucide-react';
import { FormField } from '../forms/form-field';
import { Button } from '../ui/button';
import { FormState } from '@/types';
import { addProductAction } from '../../lib/products/product-actions';
import { useActionState } from 'react';
import { cn } from '@/lib/utils';

const initialState: FormState = {
  success: false,
  message: '',
  errors: undefined,
};

/**
 * Wrapper function for the addProductAction server action.
 * This wrapper is necessary to ensure type compatibility with useActionState hook.
 * 
 * @param prevState - The previous form state containing success status, message, and errors
 * @param formData - The form data submitted by the user containing product information
 * @returns Promise<FormState> - Returns a new state object with the action result
 * 
 * Flow:
 * 1. Receives the previous state and form data from useActionState
 * 2. Calls the server action (addProductAction) with these parameters
 * 3. Transforms the result to match the FormState type structure
 * 4. Explicitly casts errors to the expected Record<string, string[]> format
 * 5. Returns the new state which will be used by useActionState to update the UI
 */
async function wrappedAddProductAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Call the server action to process the form submission
  const result = await addProductAction(prevState, formData);
  
  // Return a properly typed FormState object
  return {
    success: result.success, // Boolean indicating if the action succeeded
    message: result.message, // User-facing message (success or error description)
    errors: result.errors as Record<string, string[]> | undefined, // Field-specific validation errors
  };
}

export default function ProductSubmitForm() {
  // useActionState is a Hook that allows you to update state based on the result of a form action.

  // const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);

  // You pass useActionState an existing form action function as well as an initial state, and it returns a new action that you use in your form, along with the latest form state and whether the Action is still pending. The latest form state is also passed to the function that you provided.

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    wrappedAddProductAction,
    initialState,
  );

  const { errors, message, success } = state;
  const getFieldErrors = (fieldName: string): string[] => {
    if (!errors) return [];
    return (errors as Record<string, string[]>)[fieldName] ?? [];
  };

  return (
    <div className="mt-20">
      {/* Form action will execute direct the action without */}
      <form className="space-y-6" action={formAction}>
        {message && (
          <div
            className={cn(
              'p-4 rounded-lg border',
              success
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-destructive/10 border-destructive text-destructive',
            )}
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}
        <FormField
          label="Product Name"
          name="name"
          id="name"
          placeholder="My Awesome Product"
          required
          onChange={() => {}}
          error={getFieldErrors('name')}
        />
        <FormField
          label="Slug"
          name="slug"
          id="slug"
          placeholder="my-awesome-product"
          required
          onChange={() => {}}
          helperText="URL-friendly version of your product name"
          error={getFieldErrors('slug')}
        />
        <FormField
          label="Tagline"
          name="tagline"
          id="tagline"
          placeholder="A brief, catchy description"
          required
          onChange={() => {}}
          error={getFieldErrors('tagline')}
        />
        <FormField
          label="Description"
          name="description"
          id="description"
          placeholder="Tell us more about your product..."
          required
          onChange={() => {}}
          textarea
          error={getFieldErrors('websiteUrl')}
        />
        <FormField
          label="Website URL"
          name="websiteUrl"
          id="websiteUrl"
          placeholder="https://yourproduct.com"
          required
          onChange={() => {}}
          helperText="Enter your product's website or landing page"
          error={getFieldErrors('websiteUrl')}
        />
        <FormField
          label="Tags"
          name="tags"
          id="tags"
          placeholder="AI, Productivity, SaaS"
          required
          onChange={() => {}}
          error={getFieldErrors('tags')}
          helperText="Comma-separated tags (e.g., AI, SaaS, Productivity)"
        />

        <Button type="submit" size="lg" className="w-full">
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <>
              <SparklesIcon className="size-4" />
              Submit Product
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
