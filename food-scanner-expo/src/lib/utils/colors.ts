/**
 * TypeScript wrapper for colors.js
 * This allows TypeScript code to import colors with type safety
 * The actual colors are defined in colors.js (single source of truth)
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const colorsModule = require('./colors.js');

export const colors = colorsModule;

/**
 * Get hex color value by path
 * Supports both dot notation (e.g., 'gray.60') and dash notation (e.g., 'gray-60')
 * Useful for getting colors for SVG icons that need hex values
 */
export function getColor(path: string): string {
  // Support both 'gray.60' and 'gray-60' notation
  const parts = path.includes('.') ? path.split('.') : path.split('-');
  let value: any = colors;

  for (const part of parts) {
    value = value[part];
    if (value === undefined) {
      throw new Error(`Color path "${path}" not found`);
    }
  }

  return value as string;
}
