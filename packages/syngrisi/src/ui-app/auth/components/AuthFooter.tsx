import { Anchor, Center, Text } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import ky from 'ky';
import useStyle from '../commonStyles';
import config from '../../config';
import { log } from '../../shared/utils';

function AuthFooter() {
    const { classes } = useStyle();
    const {
        isLoading,
        isError,
        data,
        error,
    }: { isLoading: boolean, isError: boolean, data: any, error: any } = useQuery(
        ['version'],
        () => ky(`${config.baseUri}/v1/app/info`).then((res) => res.json()),
    );

    if (isError) {
        log.error(error);
        return null;
    }
    if (isLoading) return null;

    const tagUrl = `https://github.com/syngrisi/syngrisi/releases/tag/v${data.version}`;
    // eslint-disable-next-line consistent-return
    return (
        <Center>
            <Anchor
                href="https://github.com/syngrisi/syngrisi/tree/main/packages/syngrisi"
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
