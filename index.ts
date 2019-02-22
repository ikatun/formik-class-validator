import 'reflect-metadata';
import { transformAndValidateSync } from 'class-transformer-validator';
import { ValidationError, ValidationOptions } from 'class-validator';
import { values, size } from 'lodash';

import { Type, TypeHelpOptions } from 'class-transformer';
import { ValidateNested as OriginalValidateNested, registerDecorator, ValidationArguments } from 'class-validator';

export * from 'class-validator';

export const ValidateNested = (typeFunction: (type?: TypeHelpOptions) => Function, options: ValidationOptions) =>
    (target: any, key: string) => {
  OriginalValidateNested(options)(target, key);
  Type(typeFunction)(target, key);
}

export { TypeHelpOptions };

function convertErrorToFormikFormat(errors: Array<ValidationError>) {
  const result = {};

  for (const error of Array.from(errors)) {
    result[error.property] = values(error.constraints)[0];
    if (size(error.children) > 0) {
      result[error.property] = convertErrorToFormikFormat(error.children);
    }
  }

  return result;
}

export const formikValidate = (modelClass, data) => {
  try {
    transformAndValidateSync(modelClass, data);
    return {};
  } catch (e) {
    return convertErrorToFormikFormat(e);
  }
}

export class FormikValidatorBase {
  static createValidator() {
    return data => formikValidate(this, data);
  }
}

export function ValidateWith(validate: (args: ValidationArguments) => boolean, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return validate(args);
        }
      }
    });
  };
}
