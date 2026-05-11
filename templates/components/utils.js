/**
 * Simple class merger for Tailwind. 
 * Filters out falsy values and joins with spaces.
 */
export function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}