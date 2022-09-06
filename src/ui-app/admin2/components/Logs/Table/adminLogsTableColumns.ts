export const adminLogsTableColumns: { [key: string]: any } = {
    id: {
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'string',
    },
    hostname: {
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'string',
    },
    level: {
        headStyle: { width: '5%' },
        cellStyle: { width: '5%' },
        type: 'string',
    },
    message: {
        headStyle: { width: 'auto' },
        cellStyle: {
            width: 'auto',
        },
        type: 'string',
    },
    timestamp: {
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'date',
    },
};
