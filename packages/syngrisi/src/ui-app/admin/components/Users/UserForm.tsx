/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { useForm } from '@mantine/form';
import { ActionIcon, Group, TextInput } from '@mantine/core';
import { IconEdit, IconSend, IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { errorMsg, log } from '../../../shared/utils';
import { Password } from '../../../shared/components/Password';
import ActionPopoverIcon from '../../../shared/components/ActionPopoverIcon';
import { GenericService } from '../../../shared/services';
import SafeSelect from '../../../shared/components/SafeSelect';
import IUser from '../../../shared/interfaces/IUser';
import { successMsg } from '../../../shared/utils/utils';

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

    const form = useForm({
        initialValues: {
            id,
            username,
            firstName,
            lastName,
            role,
            password: '',
            apiKey: '',
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
        (data: IUser) => GenericService.update('users', data),
        {
            onSuccess: async (result: any) => {
                successMsg({ message: `User: '${result.username}' has been successfully updated` });
                log.debug({ result });
                refetch();
            },
            onError: (e: any) => {
                errorMsg({ error: `Cannot update the user, ${String(e)}` });
                log.error(e);
            },
        },
    );

    const deleteUser = useMutation(
        (userId: string) => GenericService.delete('users', userId),
        {
            onSuccess: async () => {
                successMsg({ message: 'User has been successfully removed' });
                refetch();
            },
            onError: (e: any) => {
                errorMsg({ error: `Cannot delete the user, ${String(e)}` });
                log.error(e);
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
                        sx={{ width: '11%' }}
                        data-test="user-list-id"
                        value={id}
                        disabled
                    />
                    <TextInput
                        sx={{ width: '11%' }}
                        data-test="user-list-email"
                        value={username}
                        disabled
                        {...form.getInputProps('username')}
                    />
                    <TextInput
                        sx={{ width: '11%' }}
                        data-test="user-list-first-name"
                        aria-label="First Name"
                        value={firstName}
                        disabled={!editMode}
                        {...form.getInputProps('firstName')}
                    />
                    <TextInput
                        sx={{ width: '11%' }}
                        data-test="user-list-last-name"
                        aria-label="Last Name"
                        value={lastName}
                        disabled={!editMode}
                        {...form.getInputProps('lastName')}
                    />
                    <SafeSelect
                        sx={{ width: '11%' }}
                        data-test="user-list-role"
                        aria-label="Role"
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
                        sx={{ width: '11%' }}
                        data-test="user-list-password"
                        disabled={!editMode}
                        form={form}
                    />
                    <TextInput
                        sx={{ width: '11%' }}
                        data-test="user-list-api-key"
                        value={apiKey}
                        disabled
                    />
                    <TextInput
                        sx={{ width: '11%' }}
                        data-test="user-list-created-date"
                        value={createdDate}
                        disabled
                    />
                    <TextInput
                        sx={{ width: '11%' }}
                        data-test="user-list-updated-date"
                        value={updatedDate}
                        disabled
                    />
                    {
                        ((username !== 'Administrator') && (username !== 'Guest'))
                            ? (
                                <Group noWrap spacing={4} align="center">
                                    <ActionIcon
                                        name="editUser"
                                        data-test={!editMode ? 'user-list-update-button' : 'user-list-send-button'}
                                        aria-label={editMode ? 'Send changes' : 'Edit User'}
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
                                        size={28}
                                        loading={deleteUser.isLoading}
                                        confirmLabel="Delete"
                                        withinPortal={false}
                                    />
                                </Group>
                            )
                            : (<ActionIcon sx={{ minWidth: '60px' }} />)
                    }
                </Group>
            </form>
        </Group>
    );
}
