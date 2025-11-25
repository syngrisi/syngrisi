import { useEffect, useState } from 'react';
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
    Divider,
} from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useForm } from '@mantine/form';
import ky from 'ky';
import { useDocumentTitle } from '@mantine/hooks';
import { log } from '@shared/utils';
import config from '@config';

export default function LoginForm() {
    useDocumentTitle('Login Page');
    const [ssoEnabled, setSsoEnabled] = useState(false);
    const [ssoCheckFailed, setSsoCheckFailed] = useState(false);
    const [ssoLoading, setSsoLoading] = useState(true);

    useEffect(() => {
        setSsoLoading(true);
        ky.get(`${config.baseUri}/v1/auth/sso/status`, { retry: 2, timeout: 5000 })
            .json<{ ssoEnabled: boolean }>()
            .then(data => {
                setSsoEnabled(data.ssoEnabled);
                setSsoCheckFailed(false);
            })
            .catch(err => {
                log.error('Failed to check SSO status:', err);
                setSsoCheckFailed(true);
                // Don't show SSO button on error (conservative approach)
                setSsoEnabled(false);
            })
            .finally(() => setSsoLoading(false));
    }, []);

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

                    {ssoCheckFailed && (
                        <Text size="xs" color="orange" mb="sm">
                            Could not check SSO availability
                        </Text>
                    )}

                    {ssoEnabled && !ssoLoading && (
                        <>
                            <Button
                                fullWidth
                                component="a"
                                href={`${config.baseUri}/v1/auth/sso`}
                                mt="xl"
                                mb="lg"
                                variant="outline"
                                color="blue"
                            >
                                Sign in with SSO
                            </Button>
                            <Divider label="OR" labelPosition="center" my="lg" />
                        </>
                    )}

                    <TextInput
                        label="Email"
                        id="email"
                        placeholder="username@domain.com"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && 'Invalid email'}
                        required
                        aria-label="Email"
                        data-test="login-email-input"
                    />
                    <PasswordInput
                        label="Password"
                        id="password"
                        placeholder="Your password"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        required
                        mt="md"
                        aria-label="Password"
                        data-test="login-password-input"
                    />

                    <Group position="apart" mt="md">
                        <Checkbox
                            label="Remember me"
                            onChange={(event) => form.setFieldValue('rememberMe', event.currentTarget.checked)}
                            aria-label="Remember me"
                            data-test="login-remember-me"
                        />
                    </Group>
                    {errorMessage
                        && (
                            <Text
                                size="sm"
                                color="red"
                                mt="md"
                                id="error-message"
                                hidden={false}
                                aria-live="assertive"
                                data-test="login-error-message"
                            >
                                {errorMessage}
                            </Text>
                        )}

                    <Button
                        fullWidth
                        id="submit"
                        mt="xl"
                        color="green"
                        type="submit"
                        aria-label="Sign in"
                        data-test="login-submit"
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
