import * as React from 'react';
import { ThemeIcon, useMantineTheme, useComputedColorScheme, Text, Group } from '@mantine/core';
import { UserHooks } from '@shared/hooks';

interface Props {
    username: string
    size: number | string
    dataTest?: string
}

export function LabelUser({ username, dataTest = 'user-label', size = 'xs' }: Props) {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();

    const userQuery = UserHooks.useUsersByUsername(username);


    const userInitials = (
        userQuery.isSuccess
        && (userQuery.data.results.length > 0)
        && userQuery.data.results[0].firstName
    )
        ? `${userQuery?.data?.results[0].firstName[0]}${userQuery?.data?.results[0]?.lastName[0]}`
        : '';

    return (
        userQuery.isLoading
            ? null
            : (
                <Group gap={12} p={0} justify="space-between">
                    <ThemeIcon
                        data-test="user-icon"
                        p={16}
                        ml={-6}
                        mr={-6}
                        radius="xl"
                        color={colorScheme === 'dark' ? 'dark' : '#ffffff'}
                        style={{
                            color: colorScheme === 'dark' ? '#ffffff' : '#1a1b1e',
                            backgroundColor: colorScheme === 'dark' ? '#1a1b1e' : theme.colors.gray[0],
                            fontWeight: 600,
                            fontSize: '1rem',
                            display: 'flex',
                            // width: '2.6rem',
                            justifyContent: 'center',
                            '&:hover': {
                                backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
                            },
                        }}
                    >
                        {userInitials}
                    </ThemeIcon>
                    <Text size={size as any} data-test={dataTest}>
                        {userQuery?.data?.results[0] ? userQuery?.data?.results[0].firstName : ''}
                        &nbsp;
                        {userQuery?.data?.results[0] ? userQuery?.data?.results[0].lastName : ''}
                    </Text>
                </Group>
            )
    );
}
