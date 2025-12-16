import { Request, Response, NextFunction } from 'express';

export type Midleware = (req: Request, res: Response, next?: NextFunction) => Promise<void> ; 
