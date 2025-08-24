export const generateMaskSVG = (scanCardDimensions: { w: number; h: number; r: number } | null, controlHeight: number, resultCardHeight: number) => {
    if (!scanCardDimensions) return '';

    const { w, h, r } = scanCardDimensions;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Convert to percentage coordinates for SVG
    const centerX = 50;
    // Shift the window up by 36 pixels (32 + 4)
    const centerY = 50 - (((controlHeight * 2 + resultCardHeight + 64) / 2 + 2) / viewportHeight) * 100;
    const widthPercent = ((w - 22) / viewportWidth) * 100;
    const heightPercent = ((h - controlHeight - 4 - 22) / viewportHeight) * 100;

    // Use your existing radius calculations to maintain proper aspect ratio
    const radiusPercentY = (r / viewportHeight) * 100;
    const radiusPercentX = (r / viewportWidth) * 100;

    console.log(`viewportWidth: ${viewportWidth}, viewportHeight: ${viewportHeight}, w: ${w}, h: ${h}, r: ${r}`);

    // Create a custom path for the scanning window
    // Top-left corner: rounded with radiusPercentX/radiusPercentY
    // Top-right corner: rounded with radiusPercentX/radiusPercentY
    // Bottom-left corner: sharp (no radius)
    // Bottom-right corner: sharp (no radius)
    const x1 = centerX - widthPercent / 2;
    const y1 = centerY - heightPercent / 2;
    const x2 = centerX + widthPercent / 2;
    const y2 = centerY + heightPercent / 2;

    // Custom path: M (start), L (line), A (arc for rounded corners), Z (close)
    // Using your radiusPercentX and radiusPercentY for proper aspect ratio
    const path = `M ${x1 + radiusPercentX} ${y1} L ${x2 - radiusPercentX} ${y1} A ${radiusPercentX} ${radiusPercentY} 0 0 1 ${x2} ${y1 + radiusPercentY} L ${x2} ${y2} L ${x1} ${y2} L ${x1} ${y1 + radiusPercentY} A ${radiusPercentX} ${radiusPercentY} 0 0 1 ${x1 + radiusPercentX} ${y1} Z`;

    return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 100 100' preserveAspectRatio='none'><defs><mask id='cut' maskUnits='userSpaceOnUse' x='0' y='0' width='100%' height='100%'><rect x='0' y='0' width='100%' height='100%' fill='white'/><path d='${path}' fill='black'/></mask></defs><rect x='0' y='0' width='100%' height='100%' fill='white' mask='url(%23cut)'/></svg>`;
  };