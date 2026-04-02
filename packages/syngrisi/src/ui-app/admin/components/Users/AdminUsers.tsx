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
    ScrollArea, ActionIcon, useMantineTheme, useComputedColorScheme,
} from '@mantine/core';
import { useContext, useEffect, useState } from 'react';

import { IconRefresh } from '@tabler/icons-react';
import { useNavProgressFetchEffect, UserHooks, useSubpageEffect } from '@shared/hooks';
import UserForm from '@admin/components/Users/UserForm';
import IUser from '@shared/interfaces/IUser';

import UserAddForm from '@admin/components/Users/UserAddForm';
import { AppContext } from '@admin/AppContext';

const headInputStyle: React.CSSProperties = {
    paddingLeft: '12px',
    paddingRight: '12px',
};

export default function AdminUsers() {
    const { updateToolbar }: any = useContext(AppContext);
    useSubpageEffect('Users');

    const { isLoading, error, data, refetch, isSuccess, isFetching } = UserHooks.useAllUsers();
    useNavProgressFetchEffect(isFetching);
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme('light');
    // eslint-disable-next-line prefer-arrow-callback
    useEffect(function addReloadIcon() {
        updateToolbar(
            <ActionIcon
                title="reload users"
                color={colorScheme === 'dark' ? 'green.8' : 'green.6'}
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

    if (isLoading) {
        return (
            <LoadingOverlay visible />
        );
    }
    if (error) {
        return (
            <Text c="red">
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
                style={{ width: '100%' }}
            >
                <Box p={20}>
                    <Title>Users</Title>
                    <Group gap="xs" wrap="nowrap" mt={40}>
                        <TextInput
                            style={{ width: '11%' }}
                            readOnly
                            styles={{ input: headInputStyle }}
                            variant="unstyled"
                            value="Id"
                        />
                        <TextInput
                            style={{ width: '11%' }}
                            readOnly
                            styles={{ input: headInputStyle }}
                            variant="unstyled"
                            value="Username"
                        />
                        <TextInput
                            style={{ width: '11%' }}
                            readOnly
                            styles={{ input: headInputStyle }}
                            variant="unstyled"
                            value="First Name"
                        />
                        <TextInput
                            style={{ width: '11%' }}
                            readOnly
                            styles={{ input: headInputStyle }}
                            variant="unstyled"
                            value="Last Name"
                        />
                        <TextInput
                            style={{ width: '11%' }}
                            readOnly
                            styles={{ input: headInputStyle }}
                            variant="unstyled"
                            value="Role"
                        />
                        <TextInput
                            style={{ width: '11%' }}
                            readOnly
                            styles={{ input: headInputStyle }}
                            variant="unstyled"
                            value="Password"
                        />
                        <TextInput
                            style={{ width: '11%' }}
                            readOnly
                            styles={{ input: headInputStyle }}
                            variant="unstyled"
                            value="API Key"
                        />
                        <TextInput
                            style={{ width: '11%' }}
                            readOnly
                            styles={{ input: headInputStyle }}
                            variant="unstyled"
                            value="Created"
                        />
                        <TextInput
                            style={{ width: '11%' }}
                            readOnly
                            styles={{ input: headInputStyle }}
                            variant="unstyled"
                            value="Updated"
                        />
                        <Box component="div" style={{ minWidth: '71px' }} />

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
                    <Group justify="center">
                        {addUser && <UserAddForm setAddUser={setAddUser} refetch={refetch} />}
                    </Group>
                    <Group justify="center" mt={40} mb={150}>
                        {!addUser && <Button onClick={() => setAddUser(true)} id="add-new-user" aria-label="Add New User">Add New User</Button>}
                    </Group>
                </Box>
            </ScrollArea.Autosize>
        );
    }
    return (
        <Text c="red">Unknown Error</Text>
    );
}
