/**
 * SAML IdP Metadata Loader Service
 *
 * Loads and parses SAML IdP metadata XML from a URL.
 * Supports automatic discovery of SSO URL, certificate, and entity ID.
 */

import { XMLParser } from 'fast-xml-parser';
import log from '@logger';

export interface ParsedIdPMetadata {
    entityID: string;
    ssoUrl: string;
    certificate: string;
}

interface CacheEntry {
    data: ParsedIdPMetadata;
    expiresAt: Date;
}

export class MetadataLoaderService {
    private static instance: MetadataLoaderService;
    private cache: Map<string, CacheEntry> = new Map();
    private parser: XMLParser;

    private constructor() {
        this.parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
        });
    }

    static getInstance(): MetadataLoaderService {
        if (!MetadataLoaderService.instance) {
            MetadataLoaderService.instance = new MetadataLoaderService();
        }
        return MetadataLoaderService.instance;
    }

    /**
     * Load IdP metadata from URL
     * @param metadataUrl - URL to fetch metadata from
     * @param cacheTtlMinutes - Cache TTL in minutes (default: 60)
     */
    async loadFromUrl(metadataUrl: string, cacheTtlMinutes = 60): Promise<ParsedIdPMetadata> {
        // Check cache first
        const cached = this.cache.get(metadataUrl);
        if (cached && cached.expiresAt > new Date()) {
            log.debug('Using cached IdP metadata', { url: metadataUrl });
            return cached.data;
        }

        log.info('Fetching IdP metadata', { url: metadataUrl });

        const response = await fetch(metadataUrl, {
            headers: { Accept: 'application/xml, text/xml' },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch IdP metadata: HTTP ${response.status} ${response.statusText}`);
        }

        const xmlText = await response.text();
        const parsed = this.parseMetadataXml(xmlText);

        // Store in cache
        this.cache.set(metadataUrl, {
            data: parsed,
            expiresAt: new Date(Date.now() + cacheTtlMinutes * 60 * 1000),
        });

        log.info('Successfully loaded IdP metadata', {
            url: metadataUrl,
            entityID: parsed.entityID,
            ssoUrl: parsed.ssoUrl,
        });

        return parsed;
    }

    /**
     * Clear cache (useful for testing or manual refresh)
     */
    clearCache(): void {
        this.cache.clear();
        log.debug('IdP metadata cache cleared');
    }

    /**
     * Parse SAML metadata XML and extract required fields
     */
    private parseMetadataXml(xmlText: string): ParsedIdPMetadata {
        const doc = this.parser.parse(xmlText);

        // EntityDescriptor can be root or nested, with or without namespace prefix
        const entityDescriptor = this.findElement(doc, ['EntityDescriptor', 'md:EntityDescriptor']);
        if (!entityDescriptor) {
            throw new Error('Invalid SAML metadata: EntityDescriptor not found');
        }

        const entityID = entityDescriptor['@_entityID'];
        if (!entityID) {
            throw new Error('Invalid SAML metadata: entityID attribute not found');
        }

        // Find IDPSSODescriptor
        const idpDescriptor = this.findElement(entityDescriptor, ['IDPSSODescriptor', 'md:IDPSSODescriptor']);
        if (!idpDescriptor) {
            throw new Error('Invalid SAML metadata: IDPSSODescriptor not found');
        }

        // Find SSO URL (prefer HTTP-Redirect, fallback to HTTP-POST)
        const ssoUrl = this.extractSsoUrl(idpDescriptor);
        if (!ssoUrl) {
            throw new Error('Invalid SAML metadata: SingleSignOnService URL not found');
        }

        // Find signing certificate
        const certificate = this.extractCertificate(idpDescriptor);
        if (!certificate) {
            throw new Error('Invalid SAML metadata: signing certificate not found');
        }

        return { entityID, ssoUrl, certificate };
    }

    /**
     * Find an element by trying multiple possible names (for namespace variations)
     */
    private findElement(parent: Record<string, unknown>, names: string[]): Record<string, unknown> | null {
        for (const name of names) {
            if (parent[name]) {
                return parent[name] as Record<string, unknown>;
            }
        }
        return null;
    }

    /**
     * Extract SSO URL from IDPSSODescriptor
     */
    private extractSsoUrl(idpDescriptor: Record<string, unknown>): string | null {
        const ssoServiceElement = this.findElement(idpDescriptor, ['SingleSignOnService', 'md:SingleSignOnService']);
        if (!ssoServiceElement) {
            return null;
        }

        // Can be array or single object
        const ssoServices = Array.isArray(ssoServiceElement) ? ssoServiceElement : [ssoServiceElement];

        // Prefer HTTP-Redirect binding, then HTTP-POST
        const preferredBindings = [
            'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
            'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
        ];

        for (const binding of preferredBindings) {
            const service = ssoServices.find(
                (s: Record<string, unknown>) =>
                    (s['@_Binding'] as string)?.includes(binding.split(':').pop() || '')
            );
            if (service && service['@_Location']) {
                return service['@_Location'] as string;
            }
        }

        // Fallback: take first available
        const firstService = ssoServices[0] as Record<string, unknown>;
        return (firstService?.['@_Location'] as string) || null;
    }

    /**
     * Extract signing certificate from IDPSSODescriptor
     */
    private extractCertificate(idpDescriptor: Record<string, unknown>): string | null {
        const keyDescriptorElement = this.findElement(idpDescriptor, ['KeyDescriptor', 'md:KeyDescriptor']);
        if (!keyDescriptorElement) {
            return null;
        }

        // Can be array (signing + encryption) or single
        const keyDescriptors = Array.isArray(keyDescriptorElement) ? keyDescriptorElement : [keyDescriptorElement];

        // Prefer signing key, fallback to any key without use attribute
        const signingKey = keyDescriptors.find(
            (k: Record<string, unknown>) => k['@_use'] === 'signing' || !k['@_use']
        ) as Record<string, unknown>;

        if (!signingKey) {
            return null;
        }

        // Navigate to certificate: KeyInfo → X509Data → X509Certificate
        // Handle both with and without namespace prefixes
        const keyInfo = this.findElement(signingKey, ['KeyInfo', 'ds:KeyInfo']);
        if (!keyInfo) {
            return null;
        }

        const x509Data = this.findElement(keyInfo, ['X509Data', 'ds:X509Data']);
        if (!x509Data) {
            return null;
        }

        const certificate = x509Data['X509Certificate'] || x509Data['ds:X509Certificate'];
        if (!certificate) {
            return null;
        }

        // Clean up certificate (remove whitespace, newlines)
        return String(certificate).replace(/\s/g, '');
    }
}

export const metadataLoaderService = MetadataLoaderService.getInstance();
