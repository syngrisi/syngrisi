/* eslint-disable max-len */
import * as React from 'react';
import {
    Title,
    createStyles,
    NavLink,
} from '@mantine/core';

import { IconFingerprint } from '@tabler/icons';

function DemoNav() {
    const useStyles = createStyles((theme, _params, getRef) => ({
        navLink: {
            color: theme.colors.pink[5],
        },
        link: {
            textDecoration: 'none',
        },
    }));

    const { classes } = useStyles();

    return (
        <>
            <Title>Navigation</Title>
            <a href="/auth/" className={classes.link}>
                <NavLink
                    className={classes.navLink}
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
