/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerDecorator, ValidationOptions } from "class-validator";

export function IsNotBlank(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "isNotBlank",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== "string") {
            return false;
          }

          return value.trim().length > 0;
        },
        defaultMessage(args) {
          return `${args?.property} should not be blank`;
        },
      },
    });
  };
}
