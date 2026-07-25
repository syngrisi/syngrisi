import { Request, Response } from "express";
import compression from 'compression';

export function compressionFilter(req: Request, res: Response) {
    if (req.headers['x-no-compression']) {
        return false;
    }
    // Admin task streams must not be buffered/compressed (proxy timeouts + delayed UI)
    if (req.path?.includes('/tasks/task_')) {
        return false;
    }
    return compression.filter(req, res);
}
