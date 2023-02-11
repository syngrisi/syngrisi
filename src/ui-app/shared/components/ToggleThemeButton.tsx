import { Group, Switch, useMantineTheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons';

import React, { ReactElement } from 'react';

function ToggleThemeButton({ colorScheme, toggleColorScheme }: any): ReactElement {
    const dark = colorScheme === 'dark';
    const theme = useMantineTheme();
    return (
        <Group
            position="center"
            title={`Switch to ${dark ? 'light' : 'dark'} theme`}
        >
            <Switch
                data-test="theme-button"
                size="md"
                color={dark ? 'yellow' : 'blue'}
                // color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}
                checked={colorScheme === 'light'}
                onChange={(event) => {
                    toggleColorScheme();
                    event.preventDefault();
                    event.stopPropagation();
                }}
                onLabel={<IconSun size={16} stroke={2.5} color={theme.colors.yellow[4]} />}
                offLabel={<IconMoonStars size={16} stroke={2.5} color={theme.colors.blue[6]} />}
            />
        </Group>

    );
}

export default ToggleThemeButton;
