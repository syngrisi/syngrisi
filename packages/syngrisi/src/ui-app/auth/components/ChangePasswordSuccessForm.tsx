import * as React from 'react';
import {
    Paper,
    Title,
    Container,
    Button,
    Text,
} from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { useDocumentTitle } from '@mantine/hooks';

export default function ChangePasswordSuccessForm() {
    useDocumentTitle('Success');

    return (
        <Container size={420} my={40}>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Text align="center" color="green"><IconCircleCheck size="6rem" /></Text>
                <Title align="center">Success!</Title>
                <Text align="center" size={16} mt="md">
                    Your Password has been changed. Please use your new password to login!
                </Text>
                <Button
                    fullWidth
                    id="submit"
                    mt="xl"
                    color="green"
                    type="submit"
                    component="a"
                    href="/auth/"
                >
                    Sign In
                </Button>
            </Paper>
        </Container>
    );
}
