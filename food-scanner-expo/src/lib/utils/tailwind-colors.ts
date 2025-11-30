/**
 * Get Tailwind color hex values for SVG icons
 * Colors come from the shared colors.ts file (single source of truth)
 */
import { getColor } from './colors';

/**
 * Get hex color value from Tailwind color path
 * @param path - Color path like 'gray.60', 'green.60', 'red.60', etc.
 */
export function getTailwindColor(path: string): string {
  return getColor(path);
}
