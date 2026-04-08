import React from 'react';
import { ActionIcon, Box, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';

interface Props {
    newestItemsQuery: any,
    firstPageQuery: any,
}

function RefreshActionIcon({ newestItemsQuery, firstPageQuery }: Props) {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();
    const newestItems = newestItemsQuery?.data?.results.length > 50 ? '50+' : newestItemsQuery?.data?.results.length;
    const pluralCharset = newestItems > 1 ? 's' : '';
    return (
        <ActionIcon
            color={colorScheme === 'dark' ? 'green.8' : 'green.6'}
            data-test="table-refresh-icon"
            variant="subtle"
            style={{ overflow: 'visible', position: 'relative' }}
            onClick={() => firstPageQuery.refetch()}
        >
            <IconRefresh size={24} stroke={1} />

            {
                newestItemsQuery?.data?.results?.length !== undefined && newestItemsQuery?.data?.results?.length > 0
                && (
                    <Box
                        title={` You have ${newestItems} new item${pluralCharset}, refresh the page to see them`}
                        data-test="table-refresh-icon-badge"
                        style={{
                            position: 'absolute',
                            bottom: 11,
                            left: 14,
                            minWidth: 18,
                            height: 22,
                            padding: '0 6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.colors.red[6],
                            color: theme.white,
                            borderRadius: 999,
                            lineHeight: 1,
                            fontWeight: 400,
                            fontSize: '12px',
                            fontFamily: '"Roboto","Arial",sans-serif',
                            boxSizing: 'border-box',
                            overflow: 'visible',
                            zIndex: 2,
                            border: '2px solid',
                            borderColor: colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
                        }}
                    >
                        {
                            newestItems
                        }
                    </Box>
                )
            }
        </ActionIcon>
    );
}

export default RefreshActionIcon;
