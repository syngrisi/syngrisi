import { useQuery } from '@tanstack/react-query';
import { useDocumentTitle } from '@mantine/hooks';

import {
    Button, Container, LoadingOverlay, Paper, Text, Title,
} from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import * as React from 'react';
import { log } from '@shared/utils';
import config from '@config';

interface SafeResponse<T> {
    ok: boolean;
    status: number;
    data: T | null;
    isJson: boolean;
}

const fetchWithContentTypeCheck = async <T,>(url: string, caller: string): Promise<SafeResponse<T>> => {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    let data: T | null = null;

    if (isJson) {
        try {
            data = await response.json();
        } catch (e) {
            log.error(`[${caller}] Failed to parse JSON:`, e);
            data = null;
        }
    }

    return {
        ok: response.ok,
        status: response.status,
        data,
        isJson,
    };
};

function LogoutForm() {
    useDocumentTitle('Logout page');

    const logoutInfo = useQuery<SafeResponse<Record<string, unknown>>>(
        ['logout'],
        () => fetchWithContentTypeCheck<Record<string, unknown>>(`${config.baseUri}/v1/auth/logout`, 'LogoutForm.logout'),
        {
            refetchOnWindowFocus: false,
        },
    );
    const userInfo = useQuery<SafeResponse<Record<string, unknown>>>(
        ['current_user', logoutInfo.data?.status],
        () => fetchWithContentTypeCheck<Record<string, unknown>>(`${config.baseUri}/v1/users/current`, 'LogoutForm.userInfo'),
        {
            refetchOnWindowFocus: false,
            enabled: logoutInfo.isSuccess,
        },
    );

    if (logoutInfo.isError) {
        log.error(logoutInfo.error);
    }
    if (userInfo.isError) {
        log.error(userInfo.error);
    }

    const hasValidUserPayload = Boolean(userInfo.data?.isJson && userInfo.data?.data && typeof userInfo.data.data === 'object');
    const userPayload = hasValidUserPayload
        ? userInfo.data?.data as Record<string, unknown>
        : {};
    const loading = logoutInfo.isLoading || userInfo.isLoading;
    const logoutOk = Boolean(logoutInfo.data?.ok);
    const success = Boolean(logoutOk && userInfo.isSuccess && hasValidUserPayload && Object.keys(userPayload).length === 0);

    const errorMessage = (() => {
        if (logoutInfo.data && !logoutInfo.data.isJson) {
            return 'Unexpected response format during logout';
        }
        if (logoutInfo.data && !logoutInfo.data.ok) {
            const message = (logoutInfo.data.data as { message?: string } | null)?.message;
            return message || `Logout failed with status ${logoutInfo.data.status}`;
        }
        if (userInfo.data && !userInfo.data.isJson) {
            return 'Unexpected response format while loading user info';
        }
        if (userInfo.data && !userInfo.data.ok) {
            return `Failed to load user info (${userInfo.data.status})`;
        }
        if (logoutInfo.error instanceof Error) return logoutInfo.error.message;
        if (userInfo.error instanceof Error) return userInfo.error.message;
        return undefined;
    })();

    return (
        <Container size={420} my={40}>

            <LoadingOverlay
                visible={loading}
                transitionDuration={300}
                overlayBlur={1}
                loaderProps={{ color: 'green' }}
            />

            <Paper withBorder shadow="md" p={30} mt={30} radius="md" hidden={loading}>
                {
                    success
                        ? <Text align="center" color="green"><IconCircleCheck size="6rem" /></Text>
                        : <Text align="center" color="red"><IconCircleX size="6rem" /></Text>
                }
                <Title align="center">{success ? 'Success!' : 'Failed'}</Title>
                <Text align="center" size={16} mt="md">
                    {success
                        ? 'You have been successfully logged out. Click Sign In to login again.'
                        : errorMessage || 'Something went wrong'}
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
