import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Calculate base directory: dist/server -> dist -> packages/syngrisi
// Note: tsup bundles code into dist/server/server.js, so __dirname is dist/server (not dist/server/lib)
export const baseDir = path.resolve(__dirname, '..', '..');
