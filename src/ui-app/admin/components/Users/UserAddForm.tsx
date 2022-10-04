/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { useForm } from '@mantine/form';
import { Button, Group, TextInput } from '@mantine/core';
import { IconSend, IconUser, IconX } from '@tabler/icons';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { errorMsg, log } from '../../../shared/utils';
import { Password } from '../../../shared/components/Password';
import { Email } from '../../../shared/components/Email';
import { useSubpageEffect } from '../../../shared/hooks';
import { GenericService } from '../../../shared/services';
import SafeSelect from '../../../shared/components/SafeSelect';
import IUser from '../../../shared/interfaces/IUser';
import { successMsg } from '../../../shared/utils/utils';

export default function UserAddForm({ setAddUser, refetch }: any) {
    useSubpageEffect('Users');
    const [emailError, setEmailError] = useState('');
    const [emailIsFetchingStatus, setEmailIsFetchingStatus] = useState(false);
    const form = useForm({
        initialValues: {
            id: '',
            username: '',
            firstName: '',
            lastName: '',
            role: 'user',
            password: '',
            apiKey: '',
            updatedDate: '',
            createdDate: '',
        },
        validateInputOnChange: ['username'],
        validate: {
            username: (value) => {
                if (!(/^\S+@\S+$/.test(value))) {
                    return 'Invalid email format';
                }
                if (emailError) return emailError;
                return null;
            },
            password: (value) => Password.passwordsRequirementsForPopOver(value).isFail,
        },
    });

    const addUser = useMutation(
        (data: IUser) => GenericService.create<IUser>('users', data),
        {
            onSuccess: async (result: any) => {
                successMsg({ message: `User: '${result.username}' has been successfully created` });
                log.debug({ result });
                setAddUser(false);
                refetch();
            },
            onError: (e: any) => {
                errorMsg({ error: `Cannot create the user, ${String(e)}` });
                log.error(e);
            },
        },
    );

    const formSubmitHandler = (values: IUser) => {
        addUser.mutate(values);
    };

    return (
        <form onSubmit={form.onSubmit((values) => formSubmitHandler(values))}>
            <Group noWrap spacing="xs" position="right" align="start" sx={{ width: '100%' }} mt="lg">
                <Email.DuplicationFree
                    data-test="user-add-email"
                    form={form}
                    setEmailError={setEmailError}
                    setEmailIsFetchingStatus={setEmailIsFetchingStatus}
                />

                <TextInput
                    label="First Name"
                    data-test="user-add-first-name"
                    placeholder="John"
                    {...form.getInputProps('firstName')}
                    icon={<IconUser size={16} />}
                    disabled={!!form.errors.username || emailIsFetchingStatus}
                    required
                />
                <TextInput
                    label="Last Name"
                    data-test="user-add-last-name"
                    placeholder="Smith"
                    {...form.getInputProps('lastName')}
                    icon={<IconUser size={16} />}
                    disabled={!!form.errors.username || emailIsFetchingStatus}
                    required
                />

                <SafeSelect
                    label="Role"
                    data-test="user-add-role"
                    optionsData={[
                        { value: 'user', label: 'User' },
                        { value: 'reviewer', label: 'Reviewer' },
                        { value: 'admin', label: 'Admin' },
                    ]}
                    required
                    disabled={!!form.errors.username || emailIsFetchingStatus}
                    {...form.getInputProps('role')}
                />

                <Password.Popover
                    data-test="user-add-password"
                    disabled={!!form.errors.username || emailIsFetchingStatus}
                    form={form}
                    label="Password"
                />
            </Group>

            <Group spacing="xs" align="flex-end" position="center" mt="lg" noWrap>
                <Button
                    onClick={() => setAddUser(false)}
                    leftIcon={<IconX size={18} />}
                    color="red"
                    variant="light"
                >
                    Cancel
                </Button>

                <Button
                    id="create"
                    type="submit"
                    title="Create new User"
                    leftIcon={<IconSend size={18} />}
                >
                    Create
                </Button>
            </Group>
        </form>
    );
}
