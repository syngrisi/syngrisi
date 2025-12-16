import * as React from 'react';
import {
    IconBrandGithub,
    IconServer,
    IconDatabase,
    IconKey,
    IconUser,
    IconExternalLink,
} from '@tabler/icons-react';
import {
    Anchor,
    Button,
    Group,
    Loader,
    Modal,
    Stack,
    Text,
    Divider,
} from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { useQuery } from '@tanstack/react-query';
import config from '@config';
import { UserHooks } from '@shared/hooks';

interface SystemInfo {
    version: string;
    commitHash: string;
    nodeVersion: string;
    mongoVersion: string;
    authType: string;
    authEnabled: boolean;
}

export function AboutModal({ opened, setOpened }: { opened: boolean, setOpened: (opened: boolean) => void }) {
    const user = UserHooks.useCurrentUser();

    const { isLoading, data } = useQuery<SystemInfo>(
        ['systemInfo'],
        async () => {
            const res = await fetch(`${config.baseUri}/v1/app/system-info`);
            if (!res.ok) throw new Error(`[AboutModal] Failed to fetch system info: ${res.status}`);
            return res.json();
        },
        { enabled: opened }
    );

    const useStyles = createStyles((theme) => ({
        label: {
            color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
            fontSize: theme.fontSizes.sm,
            fontWeight: 500,
        },
        value: {
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontSize: theme.fontSizes.sm,
        },
        row: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
        },
        icon: {
            color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
        },
        link: {
            display: 'flex',
            alignItems: 'center',
            gap: 4,
        },
    }));

    const { classes } = useStyles();

    const tagUrl = data?.version ? `https://github.com/syngrisi/syngrisi/releases/tag/v${data.version}` : '#';
    const commitUrl = data?.commitHash ? `https://github.com/syngrisi/syngrisi/commit/${data.commitHash}` : null;

    return (
        <Modal
            size={450}
            opened={opened}
            onClose={() => setOpened(false)}
            title="About Syngrisi"
            data-test="about-modal"
        >
            {isLoading ? (
                <Group position="center" py="xl">
                    <Loader />
                </Group>
            ) : (
                <Stack spacing="md" data-test="about-modal-content">
                    <Group className={classes.row} data-test="about-version-row">
                        <IconBrandGithub size={20} className={classes.icon} />
                        <Text className={classes.label}>Version:</Text>
                        <Anchor href={tagUrl} target="_blank" className={classes.link} data-test="about-version">
                            v{data?.version}
                            <IconExternalLink size={14} />
                        </Anchor>
                        {data?.commitHash && (
                            <>
                                <Text color="dimmed">|</Text>
                                <Anchor href={commitUrl!} target="_blank" className={classes.link} data-test="about-commit">
                                    {data.commitHash}
                                    <IconExternalLink size={14} />
                                </Anchor>
                            </>
                        )}
                    </Group>

                    <Divider />

                    <Group className={classes.row} data-test="about-node-row">
                        <IconServer size={20} className={classes.icon} />
                        <Text className={classes.label}>Node.js:</Text>
                        <Text className={classes.value} data-test="about-node-version">{data?.nodeVersion}</Text>
                    </Group>

                    <Group className={classes.row} data-test="about-mongo-row">
                        <IconDatabase size={20} className={classes.icon} />
                        <Text className={classes.label}>MongoDB:</Text>
                        <Text className={classes.value} data-test="about-mongo-version">{data?.mongoVersion}</Text>
                    </Group>

                    <Divider />

                    <Group className={classes.row} data-test="about-auth-row">
                        <IconKey size={20} className={classes.icon} />
                        <Text className={classes.label}>Authentication:</Text>
                        <Text className={classes.value} data-test="about-auth-type">
                            {data?.authEnabled ? data?.authType : 'Disabled'}
                        </Text>
                    </Group>

                    {user.isSuccess && user.data && (
                        <>
                            <Divider />
                            <Group className={classes.row} data-test="about-user-row">
                                <IconUser size={20} className={classes.icon} />
                                <Text className={classes.label}>Current User:</Text>
                                <Text className={classes.value} data-test="about-user-name">
                                    {user.data.firstName} {user.data.lastName}
                                </Text>
                                <Text color="dimmed" size="sm" data-test="about-user-role">
                                    ({user.data.role})
                                </Text>
                            </Group>
                        </>
                    )}

                    <Group position="center" pt="md">
                        <Button onClick={() => setOpened(false)} data-test="about-close-button">
                            Close
                        </Button>
                    </Group>
                </Stack>
            )}
        </Modal>
    );
}
