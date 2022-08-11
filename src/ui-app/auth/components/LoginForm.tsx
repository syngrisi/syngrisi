import * as React from 'react';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Container,
    Group,
    Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import config from '../config';
import ky from 'ky';

export default function LoginForm() {
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

    const handleFormSubmissions = async (values) => {
        console.log({ values });
        const resp = await ky(
            `${config.baseUri}./v1/auth/login`,
            {
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

        const result = await resp.json();

        console.log({ result });
    };

    return (
        <Container size={420} my={40}>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form
                    onSubmit={form.onSubmit((values) => handleFormSubmissions(values))}
                >
                    <Title>Sign in</Title>
                    <TextInput
                        label="Email"
                        placeholder="username@domain.com"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && 'Invalid email'}
                        required
                    />
                    <PasswordInput
                        label="Password"
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
                    <Button
                        fullWidth
                        mt="xl"
                        color="green"
                        type="submit"
                    >
                        Sign in
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}
