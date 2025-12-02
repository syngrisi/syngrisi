import config from '@config';
import { log } from '@shared/utils/Logger';

interface PreloadedImage {
    image: HTMLImageElement;
    src: string;
    loadedAt: number;
}

interface PreloadRequest {
    src: string;
    priority: 'high' | 'medium' | 'low';
    checkId: string;
    resolve: (img: HTMLImageElement) => void;
    reject: (error: Error) => void;
}

export interface ICheck {
    _id: string;
    baselineId?: { filename?: string };
    actualSnapshotId?: { filename?: string };
    diffId?: { filename?: string };
}

interface ImagePreloadConfig {
    maxConcurrentPreloads: number;
    maxCacheSize: number; // in items
    maxCacheAge: number; // in ms
}

const DEFAULT_CONFIG: ImagePreloadConfig = {
    maxConcurrentPreloads: 4,
    maxCacheSize: 50,
    maxCacheAge: 5 * 60 * 1000, // 5 minutes
};

class ImagePreloadService {
    private preloadedImages: Map<string, PreloadedImage> = new Map();

    private preloadQueue: PreloadRequest[] = [];

    private activePreloads: number = 0;

    private config: ImagePreloadConfig;

    private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();

    constructor(cfg?: Partial<ImagePreloadConfig>) {
        this.config = { ...DEFAULT_CONFIG, ...cfg };
    }

    /**
     * Build image URL from filename
     */
    private buildImageUrl(filename: string | undefined): string | null {
        if (!filename) return null;
        return `${config.baseUri}/snapshoots/${filename}`;
    }

    /**
     * Get all image URLs for a check
     */
    getCheckImageUrls(check: ICheck): string[] {
        const urls: string[] = [];

        const baselineUrl = this.buildImageUrl(check.baselineId?.filename);
        const actualUrl = this.buildImageUrl(check.actualSnapshotId?.filename);
        const diffUrl = this.buildImageUrl(check.diffId?.filename);

        if (baselineUrl) urls.push(baselineUrl);
        if (actualUrl) urls.push(actualUrl);
        if (diffUrl) urls.push(diffUrl);

        return urls;
    }

    /**
     * Check if image is already preloaded
     */
    isPreloaded(src: string): boolean {
        const cached = this.preloadedImages.get(src);
        if (!cached) return false;

        // Check if cache is still valid
        if (Date.now() - cached.loadedAt > this.config.maxCacheAge) {
            this.preloadedImages.delete(src);
            return false;
        }

        return true;
    }

    /**
     * Get preloaded image from cache
     */
    getPreloadedImage(src: string): HTMLImageElement | null {
        if (!this.isPreloaded(src)) return null;
        return this.preloadedImages.get(src)?.image || null;
    }

    /**
     * Preload a single image
     */
    preloadImage(src: string, priority: 'high' | 'medium' | 'low' = 'medium', checkId: string = ''): Promise<HTMLImageElement> {
        // Already cached
        const cached = this.getPreloadedImage(src);
        if (cached) {
            return Promise.resolve(cached);
        }

        // Already loading
        const existingPromise = this.loadingPromises.get(src);
        if (existingPromise) {
            return existingPromise;
        }

        // Create new loading promise
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
            const request: PreloadRequest = {
                src,
                priority,
                checkId,
                resolve,
                reject,
            };

            // Add to queue based on priority
            if (priority === 'high') {
                this.preloadQueue.unshift(request);
            } else if (priority === 'medium') {
                // Insert after high priority items
                const insertIndex = this.preloadQueue.findIndex((r) => r.priority === 'low');
                if (insertIndex === -1) {
                    this.preloadQueue.push(request);
                } else {
                    this.preloadQueue.splice(insertIndex, 0, request);
                }
            } else {
                this.preloadQueue.push(request);
            }

            this.processQueue();
        });

        this.loadingPromises.set(src, promise);

        // Clean up loading promise when done
        promise.finally(() => {
            this.loadingPromises.delete(src);
        });

        return promise;
    }

    /**
     * Process the preload queue
     */
    private processQueue(): void {
        while (this.activePreloads < this.config.maxConcurrentPreloads && this.preloadQueue.length > 0) {
            const request = this.preloadQueue.shift();
            if (request) {
                this.loadImage(request);
            }
        }
    }

    /**
     * Load a single image
     */
    private loadImage(request: PreloadRequest): void {
        this.activePreloads++;

        const img = new Image();

        const cleanup = () => {
            this.activePreloads--;
            this.processQueue();
        };

        img.onload = () => {
            // Manage cache size
            this.ensureCacheSize();

            // Store in cache
            this.preloadedImages.set(request.src, {
                image: img,
                src: request.src,
                loadedAt: Date.now(),
            });

            log.debug(`[ImagePreload] Loaded: ${request.src}`);
            request.resolve(img);
            cleanup();
        };

        img.onerror = (e) => {
            log.warn(`[ImagePreload] Failed to load: ${request.src}`, e);
            request.reject(new Error(`Failed to load image: ${request.src}`));
            cleanup();
        };

        img.src = request.src;
    }

    /**
     * Ensure cache doesn't exceed max size (LRU eviction)
     */
    private ensureCacheSize(): void {
        if (this.preloadedImages.size >= this.config.maxCacheSize) {
            // Remove oldest entry
            const oldestKey = this.preloadedImages.keys().next().value;
            if (oldestKey) {
                this.preloadedImages.delete(oldestKey);
                log.debug(`[ImagePreload] Evicted from cache: ${oldestKey}`);
            }
        }
    }

    /**
     * Preload all images for a single check
     */
    async preloadCheckImages(check: ICheck, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<void> {
        const urls = this.getCheckImageUrls(check);
        await Promise.all(urls.map((url) => this.preloadImage(url, priority, check._id)));
    }

    /**
     * Preload images for multiple checks
     */
    preloadChecksImages(
        checks: ICheck[],
        options?: {
            startIndex?: number;
            count?: number;
            priority?: 'high' | 'medium' | 'low';
        },
    ): void {
        const {
            startIndex = 0,
            count = checks.length,
            priority = 'medium',
        } = options || {};

        const checksToPreload = checks.slice(startIndex, startIndex + count);

        checksToPreload.forEach((check) => {
            this.preloadCheckImages(check, priority).catch((e) => {
                log.warn(`[ImagePreload] Failed to preload check ${check._id}:`, e);
            });
        });
    }

    /**
     * Cancel pending preload for a specific URL
     */
    cancelPreload(src: string): void {
        const index = this.preloadQueue.findIndex((r) => r.src === src);
        if (index !== -1) {
            const request = this.preloadQueue.splice(index, 1)[0];
            request.reject(new Error('Preload cancelled'));
        }
    }

    /**
     * Cancel all pending preloads for a check
     */
    cancelCheckPreloads(checkId: string): void {
        const toRemove = this.preloadQueue.filter((r) => r.checkId === checkId);
        toRemove.forEach((r) => this.cancelPreload(r.src));
    }

    /**
     * Clear all cached images
     */
    clearCache(): void {
        this.preloadedImages.clear();
        this.preloadQueue.forEach((r) => r.reject(new Error('Cache cleared')));
        this.preloadQueue = [];
        log.debug('[ImagePreload] Cache cleared');
    }

    /**
     * Get cache statistics
     */
    getStats(): {
        cachedCount: number;
        pendingCount: number;
        activePreloads: number;
    } {
        return {
            cachedCount: this.preloadedImages.size,
            pendingCount: this.preloadQueue.length,
            activePreloads: this.activePreloads,
        };
    }
}

// Export singleton instance
export const imagePreloadService = new ImagePreloadService();

// Export class for testing
export { ImagePreloadService };
