import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Locate the @syngrisi/syngrisi package root regardless of build output layout.
 * Handles ts-node (src/...), tsup bundled (dist/server), and inlined chunks inside server.js.
 */
function findPackageRoot(): string {
  let current = __dirname;
  for (let depth = 0; depth < 6; depth += 1) {
    const pkgPath = path.join(current, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (pkg?.name === '@syngrisi/syngrisi') {
          return current;
        }
      } catch {
        // Ignore JSON parse errors and continue walking up
      }
    }
    const parent = path.resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  // Fallback to previous behaviour relative to compiled files
  return path.resolve(__dirname, '..', '..');
}

export const baseDir = findPackageRoot();
