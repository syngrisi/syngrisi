/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {
    LoadingOverlay,
    Title,
    Text,
    TextInput,
    Group,
    Button,
    Box,
    ScrollArea, ActionIcon, useMantineTheme,
} from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { createStyles } from '@mantine/styles';

import { IconRefresh } from '@tabler/icons';
import { useNavProgressFetchEffect, UserHooks, useSubpageEffect } from '../../../shared/hooks';
import UserForm from './UserForm';
import IUser from '../../../shared/interfaces/IUser';

import UserAddForm from './UserAddForm';
import { AppContext } from '../../AppContext';

export default function AdminUsers() {
    const { updateToolbar }: any = useContext(AppContext);
    useSubpageEffect('Users');

    const { isLoading, error, data, refetch, isSuccess, isFetching } = UserHooks.useAllUsers();
    useNavProgressFetchEffect(isFetching);
    const theme = useMantineTheme();
    // eslint-disable-next-line prefer-arrow-callback
    useEffect(function addReloadIcon() {
        updateToolbar(
            <ActionIcon
                title="reload users"
                color={theme.colorScheme === 'dark' ? 'green.8' : 'green.6'}
                variant="subtle"
                onClick={() => {
                    refetch();
                }}
            >

                <IconRefresh stroke={1} size={24} />
            </ActionIcon>,
            50,
        );
    }, []);

    const [addUser, setAddUser] = useState(false);

    // eslint-disable-next-line no-unused-vars
    const useStyles = createStyles(() => ({
        headInput: {
            paddingLeft: '12px',
            paddingRight: '12px',
        },
    }));

    const { classes } = useStyles();
    if (isLoading) {
        return (
            <LoadingOverlay visible />
        );
    }
    if (error) {
        return (
            <Text color="red">
                Error:
                {' '}
                {error.toString()}
            </Text>
        );
    }

    if (isSuccess && data) {
        return (
            <ScrollArea.Autosize
                maxHeight="90vh"
                sx={{ width: '100%' }}
            >
                <Box p={20}>
                    <Title>Users</Title>
                    <Group spacing="xs" noWrap mt={40}>
                        <TextInput
                            sx={{ width: '11%' }}
                            readOnly
                            className={classes.headInput}
                            variant="unstyled"
                            value="Id"
                        />
                        <TextInput
                            sx={{ width: '11%' }}
                            readOnly
                            className={classes.headInput}
                            variant="unstyled"
                            value="Username"
                        />
                        <TextInput
                            sx={{ width: '11%' }}
                            readOnly
                            className={classes.headInput}
                            variant="unstyled"
                            value="First Name"
                        />
                        <TextInput
                            sx={{ width: '11%' }}
                            readOnly
                            className={classes.headInput}
                            variant="unstyled"
                            value="Last Name"
                        />
                        <TextInput
                            sx={{ width: '11%' }}
                            readOnly
                            className={classes.headInput}
                            variant="unstyled"
                            value="Role"
                        />
                        <TextInput
                            sx={{ width: '11%' }}
                            readOnly
                            className={classes.headInput}
                            variant="unstyled"
                            value="Password"
                        />
                        <TextInput
                            sx={{ width: '11%' }}
                            readOnly
                            className={classes.headInput}
                            variant="unstyled"
                            value="API Key"
                        />
                        <TextInput
                            sx={{ width: '11%' }}
                            readOnly
                            className={classes.headInput}
                            variant="unstyled"
                            value="Created"
                        />
                        <TextInput
                            sx={{ width: '11%' }}
                            readOnly
                            className={classes.headInput}
                            variant="unstyled"
                            value="Updated"
                        />
                        <Box component="div" sx={{ minWidth: '71px' }} />

                    </Group>
                    <Group>
                        {
                            data.results.map((user: IUser) => (
                                <UserForm
                                    id={user.id}
                                    key={user.id}
                                    username={user.username}
                                    firstName={user.firstName}
                                    lastName={user.lastName}
                                    role={user.role}
                                    password=""
                                    apiKey={user.apiKey || ''}
                                    updatedDate={user.updatedDate || ''}
                                    createdDate={user.createdDate}
                                    refetch={refetch}
                                />
                            ))
                        }
                    </Group>
                    <Group position="center">
                        {addUser && <UserAddForm setAddUser={setAddUser} refetch={refetch} />}
                    </Group>
                    <Group position="center" mt={40}>
                        {!addUser && <Button onClick={() => setAddUser(true)} id="add-new-user">Add New User</Button>}
                    </Group>
                </Box>
            </ScrollArea.Autosize>
        );
    }
    return (
        <Text color="red">Unknown Error</Text>
    );
}
