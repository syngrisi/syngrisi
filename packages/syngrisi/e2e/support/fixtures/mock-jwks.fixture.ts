import { test as base } from '@playwright/test';
import * as jose from 'jose';
import { createServer, Server } from 'http';
import { AddressInfo } from 'net';

export type MockJwksFixture = {
    jwksUrl: string;
    signToken: (payload: any, expiresIn?: string) => Promise<string>;
    signInvalidToken: (payload: any) => Promise<string>;
};

export const mockJwksFixture = base.extend<{ mockJwks: MockJwksFixture }>({
    mockJwks: async ({ }, use) => {
        // 1. Generate Key Pair
        const { publicKey, privateKey } = await jose.generateKeyPair('RS256', { extractable: true });
        const privateJwk = await jose.exportJWK(privateKey);
        const publicJwk = await jose.exportJWK(publicKey);
        const kid = 'test-key-id';
        publicJwk.kid = kid;
        publicJwk.use = 'sig';
        publicJwk.alg = 'RS256';

        // 2. Setup JWKS Response
        const jwks = {
            keys: [publicJwk],
        };

        // 3. Start Local HTTP Server
        const server = createServer((req, res) => {
            if (req.url === '/.well-known/jwks.json') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(jwks));
            } else {
                res.writeHead(404);
                res.end();
            }
        });

        await new Promise<void>((resolve) => server.listen(0, resolve));
        const port = (server.address() as AddressInfo).port;
        const jwksUrl = `http://localhost:${port}/.well-known/jwks.json`;

        // 4. Helper to sign tokens
        const signToken = async (payload: any, expiresIn = '1h') => {
            return new jose.SignJWT(payload)
                .setProtectedHeader({ alg: 'RS256', kid })
                .setIssuedAt()
                .setExpirationTime(expiresIn)
                .setIssuer('e2e-test-issuer')
                .setAudience('syngrisi')
                .sign(privateKey);
        };

        // 5. Helper to sign invalid tokens (wrong key)
        const signInvalidToken = async (payload: any) => {
            const { privateKey: wrongKey } = await jose.generateKeyPair('RS256');
            return new jose.SignJWT(payload)
                .setProtectedHeader({ alg: 'RS256', kid }) // Same kid, but different key -> sig validation fail
                .setIssuedAt()
                .setIssuer('e2e-test-issuer')
                .setAudience('syngrisi')
                .sign(wrongKey);
        };

        await use({ jwksUrl, signToken, signInvalidToken });

        // Cleanup
        server.close();
    },
});
