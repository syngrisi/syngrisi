import fs from 'fs';

export function createTempDir(): void {
    const dir = '.tmp';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}
