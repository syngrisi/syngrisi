export const adminLogsCreateStyle = (theme: any) => ({
    rowSelected: {
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0],
    },
    header: {
        position: 'sticky',
        // width: 'inherit',
        top: 0,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease',

        '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderBottom: `1px solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
            }`,
        },
    },
    scrolled: {
        boxShadow: theme.shadows.sm,
    },
    tableBody: {
        // '&::before': {
        //     content: '""',
        //     display: 'block',
        //     height: '42px',
        // },
    },
});
