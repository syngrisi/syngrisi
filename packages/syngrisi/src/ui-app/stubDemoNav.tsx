/* eslint-disable max-len */
import * as React from 'react';
import {
    Title,
    NavLink,
} from '@mantine/core';

import { IconFingerprint } from '@tabler/icons-react';

function DemoNav() {
    return (
        <>
            <Title>Navigation</Title>
            <a href="/auth/" style={{ textDecoration: 'none' }}>
                <NavLink
                    style={{ color: 'var(--mantine-color-pink-5)' }}
                    key={1}
                    label="Xxxx"
                    description="Decsription"
                    // rightSection={item.rightSection}
                    icon={<IconFingerprint size={16} stroke={1.5} />}
                    // onClick={() => setActive(index)}
                />
            </a>
        </>
    );
}

export default DemoNav;
