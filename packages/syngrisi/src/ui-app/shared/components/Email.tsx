/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { IconAt } from '@tabler/icons-react';
import { Loader, TextInput } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { GenericService } from '../services';

interface IDuplicationFreeEmail {
    form: any,
    setEmailError: any,
    setEmailIsFetchingStatus: React.Dispatch<React.SetStateAction<boolean>>,
    disabled?: boolean,
    label?: string
    setErrorOnRuntime?: boolean
}

export const Email = {
    // eslint-disable-next-line react/require-default-props
    DuplicationFree(
        {
            form,
            setEmailError,
            setEmailIsFetchingStatus,
            disabled = false,
            label = 'Email',
            setErrorOnRuntime = true,
            ...rest
        }: IDuplicationFreeEmail,
    ) {
        const useEmailCheckQuery = () => useQuery(
            ['userByEmail', form.values.username],
            // eslint-disable-next-line arrow-body-style
            async () => {
                return GenericService.get('users', { username: form.values.username });
            },
            {
                enabled: !!form.values.username && (/^\S+@\S+$/.test(form.values.username)),
                refetchOnWindowFocus: false,
                onSuccess: (data) => {
                    const { results } = data;
                    if ((results.length > 0)) {
                        setEmailError('user with this email already exists');
                        if (setErrorOnRuntime) form.setFieldError('username', 'user with this email already exists');
                        return;
                    }
                    setEmailError(null);
                    if (setErrorOnRuntime) form.setFieldError('username', null);
                },
                onError: () => {
                    setEmailError('cannot check the field, connection error');
                    if (setErrorOnRuntime) form.setFieldError('username', 'cannot check the field, connection error');
                },
            },
        );

        const userByEmailQuery = useEmailCheckQuery();
        useEffect(() => {
            setEmailIsFetchingStatus(userByEmailQuery.isFetching);
        }, [userByEmailQuery.isFetching]);

        return (
            <TextInput
                label={label}
                aria-label={label}
                placeholder="j.smith@example.com"
                {...form.getInputProps('username')}
                required
                rightSection={(userByEmailQuery.isFetching)
                && <Loader size="xs" />}
                icon={<IconAt size={16} />}
                autoComplete="nope"
                disabled={disabled}
                id="email"
                styles={
                    () => (
                        { input: { paddingRight: 36 } }
                    )
                }
                {...rest}
            />
        );
    },
};
