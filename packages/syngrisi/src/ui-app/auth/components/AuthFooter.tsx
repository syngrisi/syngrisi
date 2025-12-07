import { Anchor, Center, Text } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import useStyle from '@auth/commonStyles';
import config from '@config';
import { log } from '@shared/utils';

interface AppInfo {
    version: string;
    commitHash?: string;
}

function AuthFooter() {
    const { classes } = useStyle();
    const {
        isLoading,
        isError,
        data,
        error,
    } = useQuery<AppInfo>(
        ['version'],
        async () => {
            const res = await fetch(`${config.baseUri}/v1/app/info`);
            if (!res.ok) throw new Error(`[AuthFooter] Failed to fetch app info: ${res.status}`);
            return res.json();
        },
    );

    if (isError) {
        log.error(error);
        return null;
    }
    if (isLoading) return null;

    const tagUrl = `https://github.com/syngrisi/syngrisi/releases/tag/v${data.version}`;
    const commitUrl = data.commitHash
        ? `https://github.com/syngrisi/syngrisi/commit/${data.commitHash}`
        : null;
    // eslint-disable-next-line consistent-return
    return (
        <Center data-test="auth-footer">
            <Anchor
                href="https://github.com/syngrisi/syngrisi/tree/main/packages/syngrisi"
                target="_blank"
                className={classes.footerLink}
                data-test="auth-footer-github"
            >
                <IconExternalLink size="1rem" stroke={1} />
                GitHub
            </Anchor>
            <Text component="span" className={classes.footerText}>|</Text>
            <Anchor
                className={classes.footerLink}
                href={tagUrl}
                data-test="auth-footer-version"
            >
                {`v${data.version}`}
            </Anchor>
            {data.commitHash && (
                <>
                    <Text component="span" className={classes.footerText}>|</Text>
                    <Anchor
                        className={classes.footerLink}
                        href={commitUrl!}
                        target="_blank"
                        data-test="auth-footer-commit"
                    >
                        {data.commitHash}
                    </Anchor>
                </>
            )}
        </Center>
    );
}

export default AuthFooter;
