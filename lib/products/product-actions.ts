'use server';

type FormState = {
  success: boolean;
  errors?: Record<string, string[]>;
  message: string;
};

// Server Action - submitting the product

//step create the product in the table

//check if the user is authenticated

//extract the data

//validate the data

// transform the data for our request

// create the product in the table

export const addProduct = async (prevState: FormState, formData: FormData) => {
  console.log('formData', formData);

  return {
    success: true,
    errors: {},
    message: 'Product added successfully',
  };
};
