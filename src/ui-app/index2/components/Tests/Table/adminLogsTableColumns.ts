export const adminLogsTableColumns: { [key: string]: any } = {
    _id: {
        label: 'Id',
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'IdFilter',
    },
    name: {
        label: 'Name',
        headStyle: { width: '20%' },
        cellStyle: { width: '20%' },
        type: 'StringFilter',
    },
    creatorUsername: {
        label: 'Created',
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'StringFilter',
    },
    markedAs: {
        label: 'Accepted',
        headStyle: { width: 'auto' },
        cellStyle: {
            width: 'auto',
        },
        type: 'StringFilter',
    },
    startDate: {
        label: 'Date',
        headStyle: { width: '5%' },
        cellStyle: { width: '5%' },
        type: 'DateFilter',
    },
    browserName: {
        label: 'Browser',
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'StringFilter',
    },
    os: {
        label: 'Platform',
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'StringFilter',
    },
    run: {
        label: 'Platform',
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'IdFilter',
    },
    suite: {
        label: 'Platform',
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'IdFilter',
    },
    branch: {
        label: 'Branch',
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'StringFilter',
    },
    viewport: {
        label: 'Viewport',
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'StringFilter',
    },
};
