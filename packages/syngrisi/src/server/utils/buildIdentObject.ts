import { ident } from './ident';

export interface IdentType {
  name: string;
  viewport: string;
  browserName: string;
  os: string;
  app: string;
  branch: string;
}

type IdentableObject = Partial<IdentType> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

class MissingIdentFieldError extends Error {
  constructor(field: string) {
    super(`Missing required ident field: ${field}`);
    this.name = 'MissingIdentFieldError';
  }
}

export const buildIdentObject = (params: IdentableObject): IdentType => {
  const result = {} as IdentType;
  for (const key of ident) {
    if (key in params && params[key] !== undefined) {
      result[key as keyof IdentType] = params[key] as string;
    } else {
      throw new MissingIdentFieldError(key);
    }
  }
  return result;
};