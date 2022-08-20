/* eslint-disable max-len */
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
    MantineProvider,
    Paper,
    Text,
    TypographyStylesProvider,
    Container,
    MantineThemeOverride,
} from '@mantine/core';

import DemoNav from './stubDemoNav';
import DemoColors from './stubDemoColors';

const syngrisiTheme: MantineThemeOverride = {
    colors: {
        // https://maketintsandshades.com/#06ba0e
        s_success: ['#9be39f', '#83dd87', '#6ad66e', '#51cf56', '#38c83e', '#1fc126', '#06ba0e', '#49ba4d', '#41a645', '#39913c'],
    },
    colorScheme: 'light',
    // primaryColor: 'success',
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <MantineProvider
        withNormalizeCSS
        withGlobalStyles
        theme={
            syngrisiTheme
        }
    >
        <Paper>
            <h1>Vite, React, Mantine Stub Page</h1>
            <Text>
                <TypographyStylesProvider>
                    <div dangerouslySetInnerHTML={{
                        __html:
                            `This file is for Vite builder, the tool parse it and build corresponding asserts in
                         the <b>xdist/assert</b> folder read more at <a href="https://vitejs.dev/guide/stub.html#index-html-and-project-root">vite doc</a>
                         run 'vite build' to perform asserts building`,
                    }}
                    />
                </TypographyStylesProvider>
            </Text>
        </Paper>
        <DemoColors />
        <Container style={{ padding: '30px' }}>
            <DemoNav />
        </Container>
    </MantineProvider>,
);
