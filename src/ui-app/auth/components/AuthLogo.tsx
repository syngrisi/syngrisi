/* eslint-disable react/jsx-max-props-per-line,max-len */
import {
    Box,
    Container,
    Image,
    Paper,
    Text, Title, useMantineTheme,
} from '@mantine/core';
import * as React from 'react';

function AuthLogo() {
    const theme = useMantineTheme();
    const { colorScheme } = theme;
    console.log(theme);
    return (
        <Container style={{
            paddingTop: '50px',
            // paddingLeft: '550px',
            display: 'flex',
            alignItems: 'center',
        }}
        >
            <Paper style={{
                // backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                padding: '5px 8px',
                borderRadius: '2px 20px 2px 20px',
            }}
            >
                {/*<Image src={logo} width={55} />*/}
                <svg width="54" viewBox="0 0 64 67" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                color: 'white',
                fontSize: '3rem',
                paddingLeft: '8px',
                fontWeight: 600,
            }}
            >
                <Paper style={{backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                    <Text color={(colorScheme === 'dark' ? '' : 'white')}>Syngrisi</Text>
                    {/*<Text>Syngrisi</Text>*/}
                </Paper>
            </Box>

        </Container>
    );
}

export default AuthLogo;
