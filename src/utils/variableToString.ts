/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * It takes an object with a single key and returns the key as a string
 * @param variable - The variable to convert to a string.
 * @returns The first key of the object.
 */
export function variableToString(variable: { [key: string]: any }) {
  return Object.keys(variable)[0];
}
