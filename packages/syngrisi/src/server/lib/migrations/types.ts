import type { Connection } from 'mongoose';

export interface MigrationContext {
    connection: Connection;
}

export interface Migration {
    name: string;
    up: (ctx: MigrationContext) => Promise<void>;
}
