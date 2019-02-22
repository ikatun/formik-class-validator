import 'reflect-metadata';
import { ValidationOptions } from 'class-validator';
import { TypeHelpOptions } from 'class-transformer';
export * from 'class-validator';
export declare const ValidateNested: (typeFunction: (type?: TypeHelpOptions | undefined) => Function, options: ValidationOptions) => (target: any, key: string) => void;
export { TypeHelpOptions };
export declare const formikValidate: (modelClass: any, data: any) => {};
export declare class FormikValidatorBase {
    static createValidator(): (data: any) => {};
}
