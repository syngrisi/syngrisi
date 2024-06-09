import { Request, Response } from "express";
import compression from 'compression';

export function compressionFilter(req: Request, res: Response) {
    if (req.headers['x-no-compression']) {
        return false;
    }
    return compression.filter(req, res);
}
