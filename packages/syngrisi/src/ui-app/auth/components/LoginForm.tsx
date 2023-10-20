import * as React from 'react';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Paper,
    Title,
    Container,
    Group,
    Button,
    Text,
    LoadingOverlay,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useForm } from '@mantine/form';
import ky from 'ky';
import { useState } from 'react';
import { useDocumentTitle } from '@mantine/hooks';
import { log } from '../../shared/utils';
import config from '../../config';

export default function LoginForm() {
    useDocumentTitle('Login Page');
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            rememberMe: true,
        },

        validate: {
            email: (val) => {
                if ((val === 'Test') || (val === 'Administrator')) return null;
                return (/^\S+@\S+$/.test(val) ? null : 'Invalid email');
            },
        },
    });

    const [errorMessage, setErrorMessage] = useState('');

    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const [loader, setLoader] = useState(false);
    const successRedirectUrl: string = searchParams.get('origin') || '/';

    interface LoginFormData {
        email: string,
        password: string,
        rememberMe: boolean,
    }

    // eslint-disable-next-line consistent-return
    async function handleFormSubmissions(values: LoginFormData) {
        try {
            setErrorMessage('');
            setLoader(true);
            const resp = await ky(
                `${config.baseUri}/v1/auth/login`,
                {
                    throwHttpErrors: false,
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        username: values.email,
                        password: values.password,
                        rememberMe: values.rememberMe,
                    }),
                    headers: {
                        'content-type': 'application/json',
                    },
                },
            );
            const result: { message: string } = await resp.json();
            setLoader(false);

            if (result.message === 'success') {
                return window.location.assign(successRedirectUrl);
            }
            if (result.message) {
                log.error(((typeof result) === 'object') ? JSON.stringify(result) : result.toString());
                return setErrorMessage(result.message);
            }
            log.error(((typeof result) === 'object') ? JSON.stringify(result) : result.toString());
            setErrorMessage('Connection error');
        } catch (e: any) {
            log.error(e.stack || e.toString());
            setErrorMessage('Connection error');
        } finally {
            setLoader(false);
        }
    }

    return (
        <Container size={420} my={40}>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form
                    onSubmit={form.onSubmit((values) => handleFormSubmissions(values))}
                >
                    <Title>Sign in</Title>
                    <TextInput
                        label="Email"
                        id="email"
                        placeholder="username@domain.com"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && 'Invalid email'}
                        required
                    />
                    <PasswordInput
                        label="Password"
                        id="password"
                        placeholder="Your password"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        required
                        mt="md"
                    />

                    <Group position="apart" mt="md">
                        <Checkbox
                            label="Remember me"
                            onChange={(event) => form.setFieldValue('rememberMe', event.currentTarget.checked)}
                        />
                    </Group>
                    {errorMessage
                    && <Text size="sm" color="red" mt="md" id="error-message" hidden={false}>{errorMessage}</Text>}

                    <Button
                        fullWidth
                        id="submit"
                        mt="xl"
                        color="green"
                        type="submit"
                    >
                        Sign in
                    </Button>
                    <LoadingOverlay
                        visible={loader}
                        transitionDuration={300}
                        overlayBlur={1}
                        loaderProps={{ color: 'green' }}
                    />
                </form>
            </Paper>
        </Container>
    );
}
