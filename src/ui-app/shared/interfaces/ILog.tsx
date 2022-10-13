interface IObjectKeys {
    [key: string]: string | undefined;
}

export default interface ILog extends IObjectKeys {
    id: string | undefined,
    hostname: string | undefined,
    level: string | undefined,
    message: string | undefined,
    meta: any,
    timestamp: string | undefined,
}
