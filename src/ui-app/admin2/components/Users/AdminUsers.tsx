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
    ScrollArea,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import {
    resetNavigationProgress,
    setNavigationProgress,
    startNavigationProgress,
} from '@mantine/nprogress';
import { createStyles } from '@mantine/styles';
import { UserHooks } from '../../../shared/hooks';
import UserForm from './UserForm';
import IUser from '../../../shared/interfaces/IUser';

import UserAddForm from './UserAddForm';
import { useSubpageEffect } from '../../../shared/hooks/useSubpageEffect';

export default function AdminUsers() {
    useSubpageEffect('Users');

    const { isLoading, error, data, refetch, isSuccess, isFetching } = UserHooks.useAllUsers();
    const [addUser, setAddUser] = useState(false);

    // eslint-disable-next-line no-unused-vars
    const useStyles = createStyles((theme) => ({
        headInput: {
            paddingLeft: '12px',
            paddingRight: '12px',
        },
    }));

    const { classes } = useStyles();

    useEffect(() => {
        if (isFetching) {
            resetNavigationProgress();
            startNavigationProgress();
        } else {
            setNavigationProgress(100);
        }
    }, [isFetching]);

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
                    <Title>Edit Users</Title>
                    <Group spacing="xs" noWrap mt={40}>
                        <TextInput readOnly className={classes.headInput} variant="unstyled" value="Id" />
                        <TextInput readOnly className={classes.headInput} variant="unstyled" value="Username" />
                        <TextInput readOnly className={classes.headInput} variant="unstyled" value="First Name" />
                        <TextInput readOnly className={classes.headInput} variant="unstyled" value="Last Name" />
                        <TextInput readOnly className={classes.headInput} variant="unstyled" value="Role" />
                        <TextInput readOnly className={classes.headInput} variant="unstyled" value="Password" />
                        <TextInput readOnly className={classes.headInput} variant="unstyled" value="API Key" />
                        <TextInput readOnly className={classes.headInput} variant="unstyled" value="Created" />
                        <TextInput readOnly className={classes.headInput} variant="unstyled" value="Updated" />
                        <Box component="div" sx={{ width: '71px' }} />

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
                                    apiKey={user.apiKey}
                                    updatedDate={user.updatedDate}
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
