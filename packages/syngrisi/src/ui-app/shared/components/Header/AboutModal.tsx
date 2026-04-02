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
    useMantineTheme,
    useComputedColorScheme,
} from '@mantine/core';
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
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();

    const { isLoading, data } = useQuery<SystemInfo>(
        ['systemInfo'],
        async () => {
            const res = await fetch(`${config.baseUri}/v1/app/system-info`);
            if (!res.ok) throw new Error(`[AboutModal] Failed to fetch system info: ${res.status}`);
            return res.json();
        },
        { enabled: opened }
    );

    const labelStyle: React.CSSProperties = {
        color: colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
    };
    const valueStyle: React.CSSProperties = {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: theme.fontSizes.sm,
    };
    const rowStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
    };
    const iconStyle: React.CSSProperties = {
        color: colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
    };
    const linkStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
    };

    const tagUrl = data?.version ? `https://github.com/syngrisi/syngrisi/releases/tag/v${data.version}` : '#';
    const commitUrl = data?.commitHash ? `https://github.com/syngrisi/syngrisi/commit/${data.commitHash}` : null;

    return (
        <Modal
            size={450}
            opened={opened}
            onClose={() => setOpened(false)}
            title="About Syngrisi"
        >
            <div data-test="about-modal" style={{ display: 'contents' }}>
            {isLoading ? (
                <Group justify="center" py="xl">
                    <Loader />
                </Group>
            ) : (
                <Stack gap="md" data-test="about-modal-content">
                    <Group style={rowStyle} data-test="about-version-row">
                        <IconBrandGithub size={20} style={iconStyle} />
                        <Text style={labelStyle}>Version:</Text>
                        <Anchor href={tagUrl} target="_blank" style={linkStyle} data-test="about-version">
                            v{data?.version}
                            <IconExternalLink size={14} />
                        </Anchor>
                        {data?.commitHash && (
                            <>
                                <Text c="dimmed">|</Text>
                                <Anchor href={commitUrl!} target="_blank" style={linkStyle} data-test="about-commit">
                                    {data.commitHash}
                                    <IconExternalLink size={14} />
                                </Anchor>
                            </>
                        )}
                    </Group>

                    <Divider />

                    <Group style={rowStyle} data-test="about-node-row">
                        <IconServer size={20} style={iconStyle} />
                        <Text style={labelStyle}>Node.js:</Text>
                        <Text style={valueStyle} data-test="about-node-version">{data?.nodeVersion}</Text>
                    </Group>

                    <Group style={rowStyle} data-test="about-mongo-row">
                        <IconDatabase size={20} style={iconStyle} />
                        <Text style={labelStyle}>MongoDB:</Text>
                        <Text style={valueStyle} data-test="about-mongo-version">{data?.mongoVersion}</Text>
                    </Group>

                    <Divider />

                    <Group style={rowStyle} data-test="about-auth-row">
                        <IconKey size={20} style={iconStyle} />
                        <Text style={labelStyle}>Authentication:</Text>
                        <Text style={valueStyle} data-test="about-auth-type">
                            {data?.authEnabled ? data?.authType : 'Disabled'}
                        </Text>
                    </Group>

                    {user.isSuccess && user.data && (
                        <>
                            <Divider />
                            <Group style={rowStyle} data-test="about-user-row">
                                <IconUser size={20} style={iconStyle} />
                                <Text style={labelStyle}>Current User:</Text>
                                <Text style={valueStyle} data-test="about-user-name">
                                    {user.data.firstName} {user.data.lastName}
                                </Text>
                                <Text c="dimmed" size="sm" data-test="about-user-role">
                                    ({user.data.role})
                                </Text>
                            </Group>
                        </>
                    )}

                    <Group justify="center" pt="md">
                        <Button onClick={() => setOpened(false)} data-test="about-close-button">
                            Close
                        </Button>
                    </Group>
                </Stack>
            )}
            </div>
        </Modal>
    );
}
