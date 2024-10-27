/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const logAiThings = (thing: any) => {
  try {
    console.info(thing);
  } catch (error) {
    console.error(error);
  }
};

export function addSpacesBetweenWords(str: string): string {
  // Use a regular expression to insert a space before each uppercase letter
  // and trim any leading/trailing whitespace
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Handle cases like 'XMLHttpRequest'
    .trim();
}