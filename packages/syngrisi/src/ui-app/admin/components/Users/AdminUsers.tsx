/**
 * Users Admin Component
 * Manage application users: username, name, role, password and API key.
 * `password` is write-only: it can be set on create/update but the API never returns it.
 */

import * as React from 'react';
import { useState } from 'react';
import {
    Table,
    Badge,
    TextInput,
    PasswordInput,
    Select,
    Button,
    Group,
    Stack,
    Text,
    Modal,
    ActionIcon,
    Loader,
    Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUsers, IconAlertCircle, IconPlus, IconTrash, IconPencil, IconRefresh } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GenericService } from '@shared/services';
import { UserHooks, useSubpageEffect, useNavProgressFetchEffect } from '@shared/hooks';
import { Password } from '@shared/components/Password';
import { Email } from '@shared/components/Email';
import { AdminPageHeader } from '@admin/components/common/AdminPageHeader';
import IUser from '@shared/interfaces/IUser';

const ROLE_OPTIONS = [
    { value: 'user', label: 'User' },
    { value: 'reviewer', label: 'Reviewer' },
    { value: 'admin', label: 'Admin' },
];

const ROLE_COLORS: Record<string, string> = {
    admin: 'red',
    reviewer: 'blue',
    user: 'gray',
};

// Administrator and Guest are built-in system accounts and cannot be edited or removed.
const isProtectedUser = (username?: string) => username === 'Administrator' || username === 'Guest';

interface IUserFormValues {
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    password: string;
}

const emptyForm: IUserFormValues = {
    username: '',
    firstName: '',
    lastName: '',
    role: 'user',
    password: '',
};

function truncateApiKey(apiKey?: string) {
    if (!apiKey) return '—';
    if (apiKey.length <= 12) return apiKey;
    return `${apiKey.slice(0, 8)}…${apiKey.slice(-4)}`;
}

function UserModalForm({
    mode,
    initial,
    onSubmit,
    onCancel,
    submitting,
}: {
    mode: 'create' | 'edit';
    initial: IUserFormValues;
    onSubmit: (values: IUserFormValues) => void;
    onCancel: () => void;
    submitting: boolean;
}) {
    const [emailError, setEmailError] = useState<string | null>(null);
    const [emailIsFetchingStatus, setEmailIsFetchingStatus] = useState(false);

    const form = useForm({
        initialValues: initial,
        validateInputOnChange: mode === 'create' ? ['username'] : [],
        validate: {
            username: (value: string) => {
                if (mode !== 'create') return null;
                if (!(/^\S+@\S+$/.test(value))) return 'Invalid email format';
                if (emailError) return emailError;
                return null;
            },
            password: (value: string) => {
                if (mode === 'create' && !value) return 'Password is required';
                if (value && Password.passwordsRequirementsForPopOver(value).isFail) {
                    return 'Password does not meet the requirements';
                }
                return null;
            },
        },
    });

    // Fields other than username are held disabled during create until the username
    // (email) is valid and its duplicate-check request has settled - mirrors the
    // previous inline add-form behaviour.
    const fieldsDisabled = mode === 'create' && (!!form.errors.username || emailIsFetchingStatus);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <Stack gap="md">
                {mode === 'create' ? (
                    <Email.DuplicationFree
                        data-test="users-form-username"
                        label="Username"
                        form={form}
                        setEmailError={setEmailError}
                        setEmailIsFetchingStatus={setEmailIsFetchingStatus}
                    />
                ) : (
                    <TextInput
                        label="Username"
                        aria-label="Username"
                        data-test="users-form-username"
                        value={form.values.username}
                        disabled
                    />
                )}
                <TextInput
                    label="First name"
                    aria-label="First name"
                    data-test="users-form-first-name"
                    placeholder="John"
                    required
                    disabled={fieldsDisabled}
                    {...form.getInputProps('firstName')}
                />
                <TextInput
                    label="Last name"
                    aria-label="Last name"
                    data-test="users-form-last-name"
                    placeholder="Smith"
                    required
                    disabled={fieldsDisabled}
                    {...form.getInputProps('lastName')}
                />
                <Select
                    label="Role"
                    aria-label="Role"
                    data-test="users-form-role"
                    data={ROLE_OPTIONS}
                    required
                    disabled={fieldsDisabled}
                    {...form.getInputProps('role')}
                />
                <PasswordInput
                    label="Password"
                    aria-label="Password"
                    data-test="users-form-password"
                    description={mode === 'edit' ? 'Leave blank to keep the current password.' : undefined}
                    disabled={fieldsDisabled}
                    {...form.getInputProps('password')}
                />
                <Group justify="flex-end">
                    <Button variant="subtle" onClick={onCancel}>Cancel</Button>
                    <Button
                        type="submit"
                        data-test="users-form-submit"
                        aria-label="Save"
                        loading={submitting}
                        disabled={fieldsDisabled}
                    >
                        Save
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}

export default function AdminUsers() {
    useSubpageEffect('Users');
    const queryClient = useQueryClient();

    const { isLoading, error, data, refetch, isFetching } = UserHooks.useAllUsers();
    useNavProgressFetchEffect(isFetching);

    const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
    const [editingUser, setEditingUser] = useState<IUser | null>(null);
    const [deletingUser, setDeletingUser] = useState<IUser | null>(null);

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['allUsers'] });

    const createMutation = useMutation({
        mutationFn: (values: IUserFormValues) => GenericService.create<IUser>('users', values as unknown as IUser),
        onSuccess: (result: any) => {
            invalidate();
            setModalMode(null);
            showNotification({ title: 'User created', message: `User '${result.username}' has been successfully created`, color: 'green' });
        },
        onError: (err) => {
            showNotification({
                title: 'Error',
                message: err instanceof Error ? err.message : 'Cannot create the user',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: string; username: string; firstName: string; lastName: string; role: string; password?: string }) => GenericService.update('users', data),
        onSuccess: (result: any) => {
            invalidate();
            setModalMode(null);
            setEditingUser(null);
            showNotification({ title: 'User updated', message: `User '${result.username}' has been successfully updated`, color: 'green' });
        },
        onError: (err) => {
            showNotification({
                title: 'Error',
                message: err instanceof Error ? err.message : 'Cannot update the user',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        },
    });

    const removeMutation = useMutation({
        mutationFn: (userId: string) => GenericService.delete('users', userId),
        onSuccess: () => {
            invalidate();
            setDeletingUser(null);
            showNotification({ title: 'User deleted', message: 'User has been successfully removed', color: 'green' });
        },
        onError: (err) => {
            showNotification({
                title: 'Error',
                message: err instanceof Error ? err.message : 'Cannot delete the user',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        },
    });

    if (isLoading) {
        return (
            <Stack align="center" p="xl">
                <Loader />
                <Text>Loading users...</Text>
            </Stack>
        );
    }

    if (error) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                Failed to load users. Make sure you have admin permissions.
            </Alert>
        );
    }

    const users: IUser[] = data?.results || [];

    return (
        <Stack gap="lg" p="md">
            <AdminPageHeader
                icon={<IconUsers size={24} />}
                title="Users"
                description="Manage users, roles and API keys."
                actions={(
                    <>
                        <ActionIcon
                            title="reload users"
                            variant="subtle"
                            onClick={() => refetch()}
                            loading={isFetching}
                        >
                            <IconRefresh stroke={1} size={20} />
                        </ActionIcon>
                        <Button
                            data-test="users-add-button"
                            aria-label="Add User"
                            leftSection={<IconPlus size={16} />}
                            onClick={() => setModalMode('create')}
                        >
                            Add User
                        </Button>
                    </>
                )}
            />

            {users.length === 0 ? (
                <Alert color="gray">No users found.</Alert>
            ) : (
                <Table striped highlightOnHover withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Username</Table.Th>
                            <Table.Th>First name</Table.Th>
                            <Table.Th>Last name</Table.Th>
                            <Table.Th>Role</Table.Th>
                            <Table.Th>API key</Table.Th>
                            <Table.Th>Created</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {users.map((user) => (
                            <Table.Tr key={user.id} data-test={user.username}>
                                <Table.Td data-test="users-cell-username">
                                    <Text size="sm">{user.username}</Text>
                                </Table.Td>
                                <Table.Td data-test="users-cell-first-name">
                                    <Text size="sm">{user.firstName}</Text>
                                </Table.Td>
                                <Table.Td data-test="users-cell-last-name">
                                    <Text size="sm">{user.lastName}</Text>
                                </Table.Td>
                                <Table.Td data-test="users-cell-role">
                                    <Badge color={ROLE_COLORS[user.role || 'user'] || 'gray'} variant="light">
                                        {user.role}
                                    </Badge>
                                </Table.Td>
                                <Table.Td data-test="users-cell-api-key">
                                    <Text size="sm" ff="monospace" title={user.apiKey || ''}>
                                        {truncateApiKey(user.apiKey)}
                                    </Text>
                                </Table.Td>
                                <Table.Td data-test="users-cell-created">
                                    <Text size="sm" c="dimmed">
                                        {user.createdDate ? new Date(user.createdDate).toLocaleString() : ''}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    {isProtectedUser(user.username) ? (
                                        <div style={{ minWidth: '60px', height: '28px' }} />
                                    ) : (
                                        <Group gap="xs">
                                            <ActionIcon
                                                variant="subtle"
                                                title="Edit User"
                                                aria-label="Edit User"
                                                data-test="users-edit-button"
                                                onClick={() => {
                                                    setEditingUser(user);
                                                    setModalMode('edit');
                                                }}
                                            >
                                                <IconPencil size={16} />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="subtle"
                                                color="red"
                                                title="Remove user"
                                                aria-label="Remove user"
                                                data-test="users-delete-button"
                                                onClick={() => setDeletingUser(user)}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    )}
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            )}

            <Modal
                opened={modalMode !== null}
                onClose={() => {
                    setModalMode(null);
                    setEditingUser(null);
                }}
                title={modalMode === 'edit' ? 'Edit User' : 'Add User'}
            >
                <UserModalForm
                    mode={modalMode === 'edit' ? 'edit' : 'create'}
                    initial={modalMode === 'edit' && editingUser
                        ? {
                            username: editingUser.username || '',
                            firstName: editingUser.firstName || '',
                            lastName: editingUser.lastName || '',
                            role: editingUser.role || 'user',
                            password: '',
                        }
                        : emptyForm}
                    submitting={createMutation.isPending || updateMutation.isPending}
                    onCancel={() => {
                        setModalMode(null);
                        setEditingUser(null);
                    }}
                    onSubmit={(values) => {
                        if (modalMode === 'edit' && editingUser) {
                            // Don't send an empty password on update - the server keeps the
                            // existing password when the `password` field is falsy.
                            const payload: { id: string; username: string; firstName: string; lastName: string; role: string; password?: string } = {
                                id: editingUser.id as string,
                                username: values.username,
                                firstName: values.firstName,
                                lastName: values.lastName,
                                role: values.role,
                            };
                            if (values.password) payload.password = values.password;
                            updateMutation.mutate(payload);
                        } else {
                            createMutation.mutate(values);
                        }
                    }}
                />
            </Modal>

            <Modal
                opened={deletingUser !== null}
                onClose={() => setDeletingUser(null)}
                title="Delete User"
            >
                <Stack gap="md">
                    <Text>
                        Are you sure you want to delete the user
                        {' '}
                        <b>{deletingUser?.username}</b>
                        ?
                    </Text>
                    <Group justify="flex-end">
                        <Button variant="subtle" onClick={() => setDeletingUser(null)}>Cancel</Button>
                        <Button
                            color="red"
                            data-test="users-delete-confirm"
                            aria-label="Delete"
                            loading={removeMutation.isPending}
                            onClick={() => deletingUser && removeMutation.mutate(deletingUser.id as string)}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Stack>
    );
}
