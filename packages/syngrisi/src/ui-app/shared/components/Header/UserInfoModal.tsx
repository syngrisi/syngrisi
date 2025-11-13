import * as React from 'react';
import { IconAt, IconUser } from '@tabler/icons-react';
import { Avatar, Button, Group, Loader, Modal, Text } from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { UserHooks } from '../../hooks';

export function UserInfoModal({ opened, setOpened }: { opened: boolean, setOpened: any }) {
    const user = UserHooks.useCurrentUser();

    const useStyles = createStyles((theme) => ({
        icon: {
            color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
        },

        name: {
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        },
    }));

    const { classes } = useStyles();

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
                                    sx={{ textTransform: 'uppercase' }}
                                    weight={700}
                                    color="dimmed"
                                    data-test="userinfo-role"
                                >
                                    {user.data.role}
                                </Text>

                                <Text
                                    size="lg"
                                    weight={500}
                                    className={classes.name}
                                    data-test="userinfo-name"
                                >
                                    {user.data.firstName}
                                    {' '}
                                    {user.data.lastName}
                                </Text>

                                <Group
                                    noWrap
                                    spacing={5}
                                    mt={3}
                                >
                                    <IconAt stroke={1.5} size={16} className={classes.icon} />
                                    <Text size="xs" color="dimmed" data-test="userinfo-username">
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

            <Group position="center" pt={30}>
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
