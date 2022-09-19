export const adminLogsTableColumns: { [key: string]: any } = {
    _id: {
        label: 'Id',
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'IdFilter',
    },
    hostname: {
        label: 'Hostname',
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'StringFilter',
    },
    level: {
        label: 'Level',
        headStyle: { width: '5%' },
        cellStyle: { width: '5%' },
        type: 'LogLevelFilter',
    },
    message: {
        label: 'Message',
        headStyle: { width: 'auto' },
        cellStyle: {
            width: 'auto',
        },
        type: 'StringFilter',
    },
    'meta.user': {
        label: 'User',
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'StringFilter',
    },
    'meta.scope': {
        label: 'Scope',
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'StringFilter',
    },
    'meta.msgType': {
        label: 'Type',
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'StringFilter',
    },
    timestamp: {
        label: 'Timestamp',
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'DateFilter',
    },
};
