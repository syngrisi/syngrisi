/* eslint-disable react/jsx-max-props-per-line,max-len */
import * as React from 'react';
import {
    Box,
    Container,
    Paper,
    Text, useMantineTheme,
} from '@mantine/core';

function HeaderLogo({ size }: { size?: number | undefined }) {
    const theme = useMantineTheme();
    return (
        <Container
            pl={0}
            pr={0}
            style={{
                // height: 32,
                display: 'flex',
                justifyItems: 'center',
                alignItems: 'center',
            }}
        >
            <a href="/" style={{ display: 'flex', textDecoration: 'none', alignItems: 'center' }}>
                <Paper
                    data-test="logo-container"
                    sx={{
                        justifyContent: 'center',
                        height: 44,
                        width: 44,
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '2px 20px 2px 20px',
                        // backgroundColor:theme.colorScheme === 'dark' ? '#262626' : theme.colors.gray[0],
                        '&:hover': {
                            backgroundColor: theme.colorScheme === 'dark' ? '#000000' : theme.colors.gray[0],
                        },
                    }}
                >
                    <svg height={size || 32} viewBox="0 0 64 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M62.245 64.6094L7.36118 36.1968C6.98858 36.0039 6.98859 35.471 7.36118 35.2781L62.245 6.86548C62.5893 6.68725 63 6.93713 63 7.32482V64.1501C63 64.5378 62.5893 64.7876 62.245 64.6094Z"
                            fill="#2B8A3E" fillOpacity="0.38" stroke="#2B8A3E" strokeOpacity="0.6" strokeWidth="1.63692"
                        />
                        <path
                            d="M1.74625 59.1348L56.63 30.7222C57.0026 30.5293 57.0026 29.9964 56.63 29.8035L1.74625 1.39087C1.40196 1.21264 0.991211 1.46252 0.991211 1.85021V58.6755C0.991211 59.0631 1.40196 59.313 1.74625 59.1348Z"
                            fill="#1C7ED6" fillOpacity="0.4" stroke="#1C7ED6" strokeOpacity="0.6" strokeWidth="1.63692"
                        />
                    </svg>
                </Paper>

                <Box style={{
                    fontSize: '2.3rem',
                    paddingLeft: '8px',
                    letterSpacing: '-2px',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 500,
                }}
                >
                    <Paper
                        sx={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
                    >
                        <Text
                            data-test="logo-text"
                            color={(theme.colorScheme === 'dark' ? 'white' : '#262626')}
                            sx={
                                {
                                    '&:hover': {
                                        color: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.dark[3],
                                    },
                                }
                            }
                        >
                            Syngrisi
                        </Text>
                    </Paper>
                </Box>
            </a>
        </Container>
    );
}

export default HeaderLogo;
