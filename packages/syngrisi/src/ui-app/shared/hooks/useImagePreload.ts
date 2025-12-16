import { useEffect, useCallback, useState, useRef } from 'react';
import { imagePreloadService, ICheck } from '@shared/services';

interface UseImagePreloadOptions {
    enabled?: boolean;
    priority?: 'high' | 'medium' | 'low';
}

interface UseImagePreloadResult {
    isPreloaded: boolean;
    isLoading: boolean;
    error: Error | null;
    preload: () => void;
}

/**
 * Hook to preload images for a single check
 */
export function useImagePreload(
    check: ICheck | null,
    options?: UseImagePreloadOptions,
): UseImagePreloadResult {
    const { enabled = true, priority = 'medium' } = options || {};

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isPreloaded, setIsPreloaded] = useState(false);

    const checkRef = useRef(check);
    checkRef.current = check;

    const checkPreloadStatus = useCallback(() => {
        if (!check) return false;

        const urls = imagePreloadService.getCheckImageUrls(check);
        return urls.every((url) => imagePreloadService.isPreloaded(url));
    }, [check?._id]);

    const preload = useCallback(() => {
        const currentCheck = checkRef.current;
        if (!currentCheck) return;

        setIsLoading(true);
        setError(null);

        imagePreloadService
            .preloadCheckImages(currentCheck, priority)
            .then(() => {
                setIsPreloaded(true);
                setIsLoading(false);
            })
            .catch((e) => {
                setError(e);
                setIsLoading(false);
            });
    }, [priority]);

    // Auto-preload when enabled
    useEffect(() => {
        if (!enabled || !check) return;

        // Check if already preloaded
        if (checkPreloadStatus()) {
            setIsPreloaded(true);
            return;
        }

        preload();
    }, [enabled, check?._id, preload, checkPreloadStatus]);

    return {
        isPreloaded,
        isLoading,
        error,
        preload,
    };
}

interface UseImagePreloadBatchOptions {
    enabled?: boolean;
    priority?: 'high' | 'medium' | 'low';
    preloadCount?: number; // How many checks to preload
}

interface UseImagePreloadBatchResult {
    preloadedCount: number;
    totalCount: number;
    isPreloading: boolean;
}

/**
 * Hook to preload images for multiple checks (batch preloading)
 */
export function useImagePreloadBatch(
    checks: ICheck[],
    options?: UseImagePreloadBatchOptions,
): UseImagePreloadBatchResult {
    const {
        enabled = true,
        priority = 'medium',
        preloadCount = 10,
    } = options || {};

    const [preloadedCount, setPreloadedCount] = useState(0);
    const [isPreloading, setIsPreloading] = useState(false);

    // Keep reference to checks to avoid unnecessary re-renders
    const checksRef = useRef<ICheck[]>([]);
    const preloadedIdsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!enabled || checks.length === 0) return;

        // Check which checks are new
        const newChecks = checks.filter(
            (check) => !preloadedIdsRef.current.has(check._id),
        );

        if (newChecks.length === 0) return;

        // Update refs
        checksRef.current = checks;
        setIsPreloading(true);

        // Preload new checks (limited by preloadCount)
        const checksToPreload = newChecks.slice(0, preloadCount);

        imagePreloadService.preloadChecksImages(checksToPreload, { priority });

        // Track preloaded
        checksToPreload.forEach((check) => {
            preloadedIdsRef.current.add(check._id);
        });

        // Update count after a short delay to allow some preloading
        const timer = setTimeout(() => {
            setPreloadedCount(preloadedIdsRef.current.size);
            setIsPreloading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [enabled, checks.length, priority, preloadCount]);

    return {
        preloadedCount,
        totalCount: checks.length,
        isPreloading,
    };
}

/**
 * Hook to preload on hover (for Check component)
 */
export function useImagePreloadOnHover(
    check: ICheck | null,
    options?: { enabled?: boolean },
): {
    onMouseEnter: () => void;
    isPreloaded: boolean;
} {
    const { enabled = true } = options || {};
    const [isPreloaded, setIsPreloaded] = useState(false);
    const preloadStartedRef = useRef(false);

    const onMouseEnter = useCallback(() => {
        if (!enabled || !check || preloadStartedRef.current) return;

        preloadStartedRef.current = true;

        imagePreloadService
            .preloadCheckImages(check, 'high')
            .then(() => {
                setIsPreloaded(true);
            })
            .catch(() => {
                // Ignore errors on hover preload
            });
    }, [enabled, check?._id]);

    // Reset when check changes
    useEffect(() => {
        preloadStartedRef.current = false;
        setIsPreloaded(false);
    }, [check?._id]);

    return {
        onMouseEnter,
        isPreloaded,
    };
}
