export const adminLogsTableColumns: { [key: string]: any } = {
    _id: {
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'IdFilter',
    },
    hostname: {
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'StringFilter',
    },
    level: {
        headStyle: { width: '5%' },
        cellStyle: { width: '5%' },
        type: 'LogLevelFilter',
    },
    message: {
        headStyle: { width: 'auto' },
        cellStyle: {
            width: 'auto',
        },
        type: 'StringFilter',
    },
    timestamp: {
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'DateFilter',
    },
};
