export const baselinesTableColumns: { [key: string]: any } = {
    preview: {
        label: 'Preview',
        headStyle: { width: '100px' },
        cellStyle: { width: '100px' },
        type: 'None', // No filter
    },
    name: {
        label: 'Name',
        headStyle: { width: '20%' },
        cellStyle: { width: '20%' },
        type: 'StringFilter',
    },
    branch: {
        label: 'Branch',
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'StringFilter',
    },
    browserName: {
        label: 'Browser',
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'BrowserNameFilter',
    },
    viewport: {
        label: 'Viewport',
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'StringFilter',
    },
    os: {
        label: 'Platform',
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'OsFilter',
    },
    createdDate: {
        label: 'Created',
        headStyle: { width: '15%' },
        cellStyle: { width: '15%' },
        type: 'DateFilter',
    },
    usageCount: {
        label: 'Usage',
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'None',
    },
    markedAs: {
        label: 'Marked As',
        headStyle: { width: '10%' },
        cellStyle: { width: '10%' },
        type: 'AcceptedFilter',
    },
};
