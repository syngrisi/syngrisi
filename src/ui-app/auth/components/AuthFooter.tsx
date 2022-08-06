import { Anchor, Center, Text } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import ky from 'ky';
import useStyle from '../commonStyles';
import config from '../config';
import log from '../../common/utils/Logger';

function AuthFooter() {
    const { classes } = useStyle();
    log.debug('AuthFooter');

    const {
        isLoading,
        isError,
        data,
        error,
    } = useQuery(
        ['version'],
        () => ky(`${config.baseUri}./v1/app/info`).then((res) => res.json()),
    );

    if (isError) {
        console.log(error);
        return null;
    }
    if (isLoading) return null;

    const tagUrl = `https://github.com/viktor-silakov/syngrisi/releases/tag/v${data.version}`;
    // eslint-disable-next-line consistent-return
    return (
        <Center>
            <Anchor
                href="https://github.com/viktor-silakov/syngrisi"
                target="_blank"
                className={classes.footerLink}
            >
                <IconExternalLink size="1rem" stroke={1} />
                GitHub
            </Anchor>
            <Text component="span" className={classes.footerText}>|</Text>
            <Anchor
                className={classes.footerLink}
                href={tagUrl}
            >
                {`v${data.version}`}
            </Anchor>
        </Center>
    );
}

export default AuthFooter;
