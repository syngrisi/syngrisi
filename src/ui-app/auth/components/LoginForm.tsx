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

export default function LoginForm() {
    return (
        <Container size={420} my={40}>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Title>Sign in</Title>
                <TextInput label="Email" placeholder="you@mantine.dev" required />
                <PasswordInput label="Password" placeholder="Your password" required mt="md" />
                <Group position="apart" mt="md">
                    <Checkbox label="Remember me" />
                    <Anchor<'a'> onClick={(event) => event.preventDefault()} href="#" size="sm">
                        Forgot password?
                    </Anchor>
                </Group>
                <Button fullWidth mt="xl" color="green">
                    Sign in
                </Button>
            </Paper>
        </Container>
    );
}
