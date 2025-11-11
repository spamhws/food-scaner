import { Platform } from 'react-native';

interface Point {
  x: number;
  y: number;
}

interface TransformOptions {
  cornerPoints: Point[];
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Transforms barcode corner points to viewport coordinates.
 * Android camera coordinates are horizontally flipped and offset,
 * so we need to transform them to match the viewport.
 */
export function transformBarcodeCoordinates({
  cornerPoints,
  viewportWidth,
  viewportHeight,
}: TransformOptions): Point[] {
  if (Platform.OS === 'android') {
    // Android camera coordinates need transformation:
    // 1. Horizontal flip (camera is mirrored)
    // 2. Offset adjustment (camera uses wider coordinate space than viewport)
    // The 140px offset accounts for the centered crop from camera sensor to viewport
    const ANDROID_X_OFFSET = 140;

    return cornerPoints.map((p) => ({
      x: viewportWidth - p.x + ANDROID_X_OFFSET,
      y: p.y,
    }));
  }

  // iOS coordinates match viewport directly
  return cornerPoints;
}

/**
 * Checks if all barcode corner points are within the specified bounds.
 */
export function arePointsInBounds(
  points: Point[],
  bounds: { left: number; top: number; right: number; bottom: number }
): boolean {
  return points.every(
    (point) =>
      point.x >= bounds.left &&
      point.x <= bounds.right &&
      point.y >= bounds.top &&
      point.y <= bounds.bottom
  );
}

