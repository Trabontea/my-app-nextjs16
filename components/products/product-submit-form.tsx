'use client';
import { Loader2Icon, SparklesIcon } from 'lucide-react';
import { FormField } from '../forms/form-field';
import { Button } from '../ui/button';
import { FormState } from '@/types';
import { addProductAction } from '../../lib/products/product-actions';
import { useActionState } from 'react';

export default function ProductSubmitForm() {
  // useActionState is a Hook that allows you to update state based on the result of a form action.

  // const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);

  // You pass useActionState an existing form action function as well as an initial state, and it returns a new action that you use in your form, along with the latest form state and whether the Action is still pending. The latest form state is also passed to the function that you provided.

  const initialState: FormState = {
    success: false,
    errors: undefined,
    message: '',
  };

  const [state, formAction, isPending] = useActionState(
    addProductAction,
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
        <FormField
          label="Product Name"
          name="name"
          id="name"
          placeholder="My Awesome Product"
          required
          onChange={() => {}}
          error={errors?.name}
        />
        <FormField
          label="Slug"
          name="slug"
          id="slug"
          placeholder="my-awesome-product"
          required
          onChange={() => {}}
          helperText="URL-friendly version of your product name"
          error={errors?.slug}
        />
        <FormField
          label="Tagline"
          name="tagline"
          id="tagline"
          placeholder="A brief, catchy description"
          required
          onChange={() => {}}
          error={errors?.tagline}
        />
        <FormField
          label="Description"
          name="description"
          id="description"
          placeholder="Tell us more about your product..."
          required
          onChange={() => {}}
          textarea
          error={errors?.description}
        />
        <FormField
          label="Website URL"
          name="websiteUrl"
          id="websiteUrl"
          placeholder="https://yourproduct.com"
          required
          onChange={() => {}}
          helperText="Enter your product's website or landing page"
          error={errors?.websiteUrl}
        />
        <FormField
          label="Tags"
          name="tags"
          id="tags"
          placeholder="AI, Productivity, SaaS"
          required
          onChange={() => {}}
          error={errors?.tags}
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
