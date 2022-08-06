import { ActionIcon } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons';

import React, { ReactElement } from 'react';

function ToggleThemeButton({ colorScheme, toggleColorScheme }): ReactElement {

    // const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <div className="App">
            <ActionIcon
                variant="outline"
                color={dark ? 'yellow' : 'blue'}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
            >
                {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
        </div>
    );
}

export default ToggleThemeButton;
