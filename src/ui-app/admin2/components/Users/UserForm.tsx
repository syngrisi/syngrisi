/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { useForm } from '@mantine/form';
import { ActionIcon, Group, Text, TextInput } from '@mantine/core';
import { IconEdit, IconSend, IconX } from '@tabler/icons';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { log } from '../../../shared/utils';
import { Password } from '../../../shared/components/Password';
import ActionPopoverIcon from '../../../shared/components/ActionPopoverIcon';
import { UserService } from '../../../shared/services';
import SafeSelect from '../../../shared/components/SafeSelect';
import IUser from '../../../shared/interfaces/IUser';

export default function UserForm(
    {
        id,
        username,
        firstName,
        lastName,
        role,
        apiKey,
        updatedDate,
        createdDate,
        refetch,
    }: IUser,
) {
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');

    const form = useForm({
        initialValues: {
            id,
            username,
            firstName,
            lastName,
            role,
            password: '',
            apiKey,
            updatedDate,
            createdDate,
        },
        validate: {
            password: (value: string) => ((value === '')
                ? null
                : Password.passwordsRequirementsForPopOver(value).isFail),
        },
    });

    const updateUser = useMutation(
        (data: IUser) => UserService.update(data),
        {
            onSuccess: async () => {
                refetch();
            },
            onError: (e: any) => {
                log.error(e);
                return setError(`Cannot update user - ${e.toString()}`);
            },
        },
    );

    const deleteUser = useMutation(
        (userId: string) => UserService.delete(userId),
        {
            onSuccess: () => {
                refetch();
            },
            onError: (e: any) => {
                log.error(e);
                return setError(`Cannot delete user - ${e.toString()}`);
            },
        },
    );

    const update = () => {
        if (form.validate().hasErrors) return;
        updateUser.mutate(form.values);
        setEditMode(false);
    };

    const removeUser = () => {
        deleteUser.mutate(form.values.id!);
    };

    return (
        <Group>
            <form>
                <Group noWrap spacing="xs" align="center" data-test={username}>
                    <TextInput
                        data-test="user-list-id"
                        value={id}
                        disabled
                    />
                    <TextInput
                        data-test="user-list-email"
                        value={username}
                        disabled
                        {...form.getInputProps('username')}
                    />
                    <TextInput
                        data-test="user-list-first-name"
                        value={firstName}
                        disabled={!editMode}
                        {...form.getInputProps('firstName')}
                    />
                    <TextInput
                        data-test="user-list-last-name"
                        value={lastName}
                        disabled={!editMode}
                        {...form.getInputProps('lastName')}
                    />
                    <SafeSelect
                        data-test="user-list-role"
                        optionsData={[
                            { value: 'user', label: 'User' },
                            { value: 'reviewer', label: 'Reviewer' },
                            { value: 'admin', label: 'Admin' },
                        ]}
                        required
                        disabled={!editMode}
                        // disabled={false}
                        {...form.getInputProps('role')}
                    />

                    <Password.Popover
                        data-test="user-list-password"
                        disabled={!editMode}
                        form={form}
                        testAttr="password"
                    />

                    <TextInput data-test="user-list-api-key" value={apiKey} disabled />
                    <TextInput data-test="user-list-created-date" value={createdDate} disabled />
                    <TextInput data-test="user-list-updated-date" value={updatedDate} disabled />
                    {
                        ((username !== 'Administrator') && (username !== 'Guest'))
                            ? (
                                <Group noWrap spacing={4} align="center">
                                    <ActionIcon
                                        name="editUser"
                                        data-test={!editMode ? 'user-list-update-button' : 'user-list-send-button'}
                                        onClick={!editMode ? () => setEditMode(true) : update}
                                        variant="light"
                                        // type={edit && "submit"}
                                        color="green"
                                        title={editMode ? 'Send changes' : 'Edit User'}
                                        loading={updateUser.isLoading}
                                    >
                                        {
                                            editMode
                                                ? <IconSend size={18} />
                                                : <IconEdit size={18} />
                                        }
                                    </ActionIcon>
                                    <ActionPopoverIcon
                                        testAttr="user-list-remove-button"
                                        icon={<IconX size={18} />}
                                        action={removeUser}
                                        title="Remove user"
                                        loading={deleteUser.isLoading}
                                        confirmLabel="Delete"
                                    />
                                </Group>
                            )
                            : (<ActionIcon sx={{ minWidth: '60px' }} />)
                    }
                </Group>
                {
                    error && (
                        <Group align="center">
                            <Text color="red" size="xs">{error}</Text>
                        </Group>
                    )
                }
            </form>
        </Group>
    );
}
