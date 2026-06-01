import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Fusionne des classes Tailwind conditionnelles en résolvant les conflits (clsx + tailwind-merge). */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
