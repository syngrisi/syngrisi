/**
 * Native package.json finder - replacement for read-pkg-up
 * Walks up directory tree to find nearest package.json
 */

import fs from 'node:fs/promises'
import path from 'node:path'

export interface PackageResult {
    path: string
    packageJson: Record<string, unknown>
}

/**
 * Find the nearest package.json by walking up from startDir
 * Returns null if no package.json is found
 */
export async function findPackageUp(startDir: string): Promise<PackageResult | null> {
    let dir = path.resolve(startDir)

    while (true) {
        const pkgPath = path.join(dir, 'package.json')

        try {
            await fs.access(pkgPath)
            // File exists, read and parse it
            const content = await fs.readFile(pkgPath, 'utf-8')
            const packageJson = JSON.parse(content)
            return { path: pkgPath, packageJson }
        } catch {
            // File doesn't exist or can't be read, move up
            const parent = path.dirname(dir)

            // Reached filesystem root
            if (parent === dir) {
                return null
            }

            dir = parent
        }
    }
}

/**
 * read-pkg-up compatible function
 */
export async function readPackageUp(options: { cwd: string }): Promise<PackageResult | undefined> {
    const result = await findPackageUp(options.cwd)
    return result ?? undefined
}
