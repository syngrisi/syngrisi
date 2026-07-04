import * as React from 'react';
import { Group, Stack, Title, Text } from '@mantine/core';

/**
 * Shared header for admin pages: icon + title (+ optional actions) and an
 * optional dimmed description line below. Presentational only.
 */
export interface AdminPageHeaderProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    actions?: React.ReactNode;
}

export function AdminPageHeader({ icon, title, description, actions }: AdminPageHeaderProps) {
    return (
        <Stack gap={4}>
            <Group justify="space-between" align="flex-start">
                <Group gap="xs">
                    {icon}
                    <Title order={3}>{title}</Title>
                </Group>
                {actions && <Group>{actions}</Group>}
            </Group>
            {description && <Text c="dimmed" size="sm">{description}</Text>}
        </Stack>
    );
}
