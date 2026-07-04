import { HttpStatus } from '@utils';
import { ApiError, catchAsync, deserializeIfJSON, pick } from '@utils';
import { webhookService } from '@services/webhook.service';
import { Response } from "express";
import { ExtRequest } from '@types';

// Webhook `secret` is write-only: accepted on create/update but stripped here
// before any response leaves the server, mirroring how settings.controller.ts
// masks the AI provider apiKey.
const stripSecret = (doc: any) => {
    // Use toJSON() (not toObject()) so the model's toJSON plugin runs first
    // (adds `id`, strips `__v`), then remove the write-only `secret` field.
    const obj = doc?.toJSON ? doc.toJSON() : doc;
    const { secret, ...rest } = obj;
    return rest;
};

const get = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = typeof req.query.filter === 'string'
        ? deserializeIfJSON(req.query.filter) || {}
        : {};

    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await webhookService.getWebhooks(filter, options);
    res.send({
        ...result,
        results: result.results.map(stripSecret),
    });
});

const create = catchAsync(async (req: ExtRequest, res: Response) => {
    const data = pick(req.body, ['url', 'events', 'secret', 'enabled']);
    if (!data.url) throw new ApiError(HttpStatus.BAD_REQUEST, 'Cannot create webhook - "url" is required');
    const webhook = await webhookService.createWebhook(data as { url: string; events?: string[]; secret?: string; enabled?: boolean });
    res.status(HttpStatus.CREATED).send(stripSecret(webhook));
});

const update = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(HttpStatus.BAD_REQUEST, 'Cannot update webhook - Id not found');
    const data = pick(req.body, ['url', 'events', 'secret', 'enabled']);
    const webhook = await webhookService.updateWebhook(id, data);
    res.send(stripSecret(webhook));
});

const remove = catchAsync(async (req: ExtRequest, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(HttpStatus.BAD_REQUEST, 'Cannot remove webhook - Id not found');
    const webhook = await webhookService.removeWebhook(id);
    res.send(stripSecret(webhook));
});

export {
    get,
    create,
    update,
    remove,
};
