import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { commonValidations } from './utils';

extendZodWithOpenApi(z);

const WebhookEventSchema = z.enum(['check.created', 'check.updated', 'test.finished', 'run.finished']);

// Returned by GET/list/create/update. `secret` is intentionally never included -
// it is write-only (see WebhookCreateSchema/WebhookUpdateSchema) and masked by the controller.
const WebhookGetSchema = z.object({
    _id: commonValidations.id,
    id: commonValidations.id.openapi({
        description: 'ID of the webhook',
        example: '666b3b828833d0cf24a670d7'
    }),
    url: z.string().url().openapi({
        description: 'URL the webhook payload is POSTed to',
        example: 'https://example.com/hooks/syngrisi'
    }),
    events: z.array(WebhookEventSchema).openapi({
        description: 'Events this webhook is subscribed to',
        example: ['check.created', 'check.updated']
    }),
    enabled: z.boolean().openapi({
        description: 'Whether the webhook is active',
        example: true
    }),
    createdDate: commonValidations.date.optional().openapi({
        description: 'Creation date of the webhook',
        example: '2024-06-13T18:33:38.617Z'
    }),
});

const WebhookCreateSchema = z.object({
    url: z.string().url().openapi({ example: 'https://example.com/hooks/syngrisi' }),
    events: z.array(WebhookEventSchema).optional().openapi({ example: ['check.created', 'check.updated'] }),
    secret: z.string().optional().openapi({ description: 'Write-only shared secret, never returned by GET' }),
    enabled: z.boolean().optional().openapi({ example: true }),
});

const WebhookUpdateSchema = z.object({
    url: z.string().url().optional(),
    events: z.array(WebhookEventSchema).optional(),
    secret: z.string().optional(),
    enabled: z.boolean().optional(),
});

export { WebhookGetSchema, WebhookCreateSchema, WebhookUpdateSchema, WebhookEventSchema };
