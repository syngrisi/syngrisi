import { Group, Switch, useMantineTheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

import React, { ReactElement } from 'react';

function ToggleThemeButton({ colorScheme, toggleColorScheme }: any): ReactElement {
    const dark = colorScheme === 'dark';
    const theme = useMantineTheme();

    return (
        <Group
            mr={28}
            position="right"
            title={`Switch to ${dark ? 'light' : 'dark'} theme`}
        >
            <Switch
                data-test="theme-button"
                size="md"
                styles={
                    () => (
                        {
                            track: {
                                backgroundColor: theme.colors.gray[8],
                                borderColor: theme.colors.gray[8],
                            },
                        }
                    )
                }
                color="gray.8"
                checked={colorScheme === 'light'}
                onChange={() => {
                    toggleColorScheme();
                }}
                onLabel={<IconSun size={16} stroke={2.5} color={theme.colors.yellow[4]} />}
                offLabel={<IconMoonStars size={16} stroke={2.5} color={theme.colors.blue[6]} />}
            />
        </Group>
    );
}

export default ToggleThemeButton;
