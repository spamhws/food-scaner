// Auto-load all translation files
// Just add a new JSON file (e.g., de.json) and it will be automatically detected
// Make sure each JSON has a "_meta" field with "name" and "flag"

const translations: Record<string, any> = {};

// Try to require known language files
// Add more here as you add translation files
try {
  translations.en = require('./en.json');
} catch {}

try {
  translations.uk = require('./uk.json');
} catch {}

// Add more languages by copying the pattern:
// try { translations.de = require('./de.json'); } catch {}

export { translations };
