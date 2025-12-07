import { Request, Response, NextFunction } from 'express';
import semver from 'semver';
import { config } from '@config';
import log from '@logger';

/**
 * Middleware to check SDK version from request headers.
 * Logs a warning and sets deprecation header if SDK version is below minimum supported.
 * Does not block requests - only logs and warns for N-2 compatibility tracking.
 */
export const sdkVersionCheck = (req: Request, res: Response, next: NextFunction): void => {
    const sdkVersion = req.headers['x-syngrisi-sdk-version'] as string | undefined;

    if (sdkVersion) {
        // Validate that the version string is valid semver
        if (!semver.valid(sdkVersion)) {
            log.warn(`Invalid SDK version format received: ${sdkVersion}`);
            next();
            return;
        }

        // Check if SDK version is below minimum supported
        if (semver.lt(sdkVersion, config.minSupportedSdkVersion)) {
            log.warn(
                `Deprecated SDK version detected: ${sdkVersion}. ` +
                `Minimum supported version: ${config.minSupportedSdkVersion}. ` +
                `Please upgrade your SDK to ensure compatibility.`
            );

            // Set deprecation warning header for the client
            res.setHeader(
                'X-Syngrisi-Deprecation-Warning',
                `SDK version ${sdkVersion} is deprecated. Minimum supported: ${config.minSupportedSdkVersion}`
            );
        }
    }

    next();
};
