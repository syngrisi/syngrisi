import fs from 'fs';
import { config } from '@config'

export function createTempDir(): void {
    const dir = config.tmpDir;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}
