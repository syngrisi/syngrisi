import { useQuery } from '@tanstack/react-query';
import { useDocumentTitle } from '@mantine/hooks';

import ky from 'ky';
import {
    Button, Container, LoadingOverlay, Paper, Text, Title,
} from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons';
import * as React from 'react';
import { useEffect } from 'react';
import log from '../../common/utils/Logger';
import config from '../config';

function LogoutForm() {
    interface Query {
        isLoading: boolean,
        isError: boolean,
        data: any,
        error: any
    }

    useDocumentTitle('Logout page');
    // const { classes } = useStyle();
    useEffect(
        () => {
            ky(`${config.baseUri}/v1/auth/logout`);
        },
        [],
    );

    const logoutInfo: Query = useQuery(
        ['logout'],
        () => ky(`${config.baseUri}/v1/auth/logout`).then((res) => res.json()),
        {
            refetchOnWindowFocus: false,
        },
    );
    const userInfo: Query = useQuery(
        ['current_user', logoutInfo],
        () => ky(`${config.baseUri}/v1/users/current`).then((res) => res.json()),
        {
            refetchOnWindowFocus: false,
        },
    );

    if (userInfo.isError) {
        log.error(userInfo.error);
    }
    const success = !userInfo.isLoading && Object.keys(userInfo.data).length === 0;

    return (
        <Container size={420} my={40}>

            <LoadingOverlay
                visible={userInfo.isLoading}
                transitionDuration={300}
                overlayBlur={1}
                loaderProps={{ color: 'green' }}
            />

            <Paper withBorder shadow="md" p={30} mt={30} radius="md" hidden={userInfo.isLoading}>
                {
                    success
                        ? <Text align="center" color="green"><IconCircleCheck size="6rem" /></Text>
                        : <Text align="center" color="red"><IconCircleX size="6rem" /></Text>
                }
                <Title align="center">{success ? 'Success!' : 'Failed'}</Title>
                <Text align="center" size={16} mt="md">
                    {success
                        ? 'You have been successfully logged out. Click Sign In to login again.'
                        : 'Something went wrong'}
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

export default LogoutForm;
