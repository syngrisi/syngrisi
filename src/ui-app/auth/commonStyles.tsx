import { createStyles } from '@mantine/styles';

export default createStyles((theme) => ({
    footer: {
        marginTop: 120,
        borderTop: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
        }`,
    },

    footerText: {
        color: 'white',
        fontSize: '1rem',
    },
    footerLink: {
        margin: '8px',
        color: 'white',
        fontSize: '1rem',
        ':hover': {
            textDecoration: 'underline',
            // color: 'red',
            filter: 'brightness(120%)',

        },
    },
}));
