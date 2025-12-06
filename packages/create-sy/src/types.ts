export interface ProgramOpts {
    installDir: string
    npmTag: string
}

export interface Arguments {
    help?: boolean;
    yes?: boolean;
    force?: boolean;
    npmTag?: string;
    _: string[];
}
