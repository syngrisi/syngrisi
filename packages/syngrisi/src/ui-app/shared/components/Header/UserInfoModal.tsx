import * as React from 'react';
import { IconAt, IconUser } from '@tabler/icons-react';
import { Avatar, Button, Group, Loader, Modal, Text, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import { UserHooks } from '@shared/hooks';

export function UserInfoModal({ opened, setOpened }: { opened: boolean, setOpened: any }) {
    const user = UserHooks.useCurrentUser();
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();

    const iconStyle: React.CSSProperties = {
        color: colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
    };
    const nameStyle: React.CSSProperties = {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    };

    return (
        <Modal
            size={350}
            opened={opened}
            onClose={() => {
                setOpened(false);
            }}
            title="User Details"
        >
            {
                (user.isSuccess && user.data)
                    ? (
                        <Group noWrap>
                            <Avatar src={null} color="white" size={120} radius={70}>
                                <IconUser stroke={1} size={120} radius="md" />
                            </Avatar>
                            <div>
                                <Text
                                    size="xs"
                                    style={{ textTransform: 'uppercase' }}
                                    fw={700}
                                    c="dimmed"
                                    data-test="userinfo-role"
                                >
                                    {user.data.role}
                                </Text>

                                <Text
                                    size="lg"
                                    fw={500}
                                    style={nameStyle}
                                    data-test="userinfo-name"
                                >
                                    {user.data.firstName}
                                    {' '}
                                    {user.data.lastName}
                                </Text>

                                <Group
                                    noWrap
                                    gap={5}
                                    mt={3}
                                >
                                    <IconAt stroke={1.5} size={16} style={iconStyle} />
                                    <Text size="xs" c="dimmed" data-test="userinfo-username">
                                        {user.data.username}
                                    </Text>
                                </Group>
                            </div>
                        </Group>
                    )
                    : (
                        // eslint-disable-next-line react/jsx-no-useless-fragment
                        <>
                            <Loader />
                        </>
                    )
            }

            <Group justify="center" pt={30}>
                <Button
                    onClick={() => {
                        setOpened(false);
                    }}
                >
                    Close
                </Button>
            </Group>
        </Modal>
    );
}
