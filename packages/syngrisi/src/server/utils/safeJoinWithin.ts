import path from 'path';

/**
 * Safely resolve an archive entry name against a destination directory,
 * preventing Zip-Slip / path-traversal. Returns the absolute target path if it
 * stays within `destDir` (or equals it), otherwise `null` (caller must skip the
 * entry). Rejects absolute entry names and any name that escapes via `..`.
 */
export const safeJoinWithin = (destDir: string, entryName: string): string | null => {
    if (!entryName || path.isAbsolute(entryName)) {
        return null;
    }
    const resolvedDest = path.resolve(destDir);
    const resolved = path.resolve(resolvedDest, entryName);
    if (resolved === resolvedDest || resolved.startsWith(resolvedDest + path.sep)) {
        return resolved;
    }
    return null;
};
