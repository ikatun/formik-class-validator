*Installation*
```
npm install formik-class-validator
```

Use decorators-style schema to validate formik forms using class-validator library. 

The library re-exports everything from `class-validator` with the exception of `ValidateNested` which is modified to take a nested type.

formik-class-validator also exports class FormikValidatorBase which defines `createValidator` static method used to convert a class-validator class to formik validator.

Usage example, schema definition:
```typescript
import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsDateString,
  FormikValidatorBase,
  ValidateWith
} from 'formik-class-validator';
import { size } from 'lodash';

export class ProductFormModel extends FormikValidatorBase {
  @IsNotEmpty()
  @IsString({ message: 'Food type name is required' })
  name: string = '';

  @IsNotEmpty()
  @IsString({ message: 'Food category is required' })
  @ValidateWith(args => size(args.value) > 2, { message: 'Category must be longer than 2' })
  category: string = '';
  
  @IsNotEmpty()
  @ValidateWith(args => size(args.value) > size(args.object.name), { message: 'Description must be longer than name' })
  description: string = '';
}
```

Usage example, integration with formik:
```typescript jsx
import React from 'react';
import { FormikProps, Formik, Field } from 'formik';
import { ProductFormModel } from './product-form-model';

export class ProductForm extends React.Component {
  formik: FormikProps;

  handleSubmit = (values) => {
    console.log('submitting', values);
  }

  render() {
    return (
      <Formik initialValues={new ProductFormModel()} onSubmit={this.handleSubmit} validate={ProductFormModel.createValidator()}>
        {(formik: FormikProps) => {
          console.log('errors', formik.errors);
          return (
            <div>
              <div>
                name <Field name="name" />
              </div>
              <div>
                description <Field name="description" />
              </div>
              <div>
                category <Field name="category" />
              </div>
              <input type="submit" onClick={formik.handleSubmit} />
            </div>
          );
        }
      </Formik>
    )
  }
```

Usage example, nested schema definition:
```typescript
import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsDateString,
  FormikValidatorBase,
} from 'formik-class-validator';

class AdditionalInfoFormModel {
  @IsNotEmpty()
  @IsString({ message: 'Food type is required' })
  foodType: string = '';

  @IsNotEmpty()
  @IsString({ message: 'Units are required' })
  units: string;

  @IsNotEmpty()
  @IsDateString({ message: 'Expiration date is required' })
  expirationDate: string;
}

export class ProductFormModel extends FormikValidatorBase {
  @ValidateNested(() => AdditionalInfoFormModel)
  additionalInfo = new AdditionalInfoFormModel();

  @IsNotEmpty()
  @IsString({ message: 'Food type name is required' })
  name: string;

  @IsNotEmpty()
  @IsString({ message: 'Food description is required' })
  description: string;

  @IsNotEmpty()
  @IsString({ message: 'Food category is required' })
  category: string;
}
```
