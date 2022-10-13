import * as React from 'react';
import { Group, Skeleton, Stack } from '@mantine/core';

interface Props {
}

export function ChecksSkeleton(props: Props) {
    return (
        <Group>
            <Stack>
                <Skeleton height={230} width={230} />
                <Skeleton height={20} width={230} />
            </Stack>
            <Stack>
                <Skeleton height={230} width={230} />
                <Skeleton height={20} width={230} />
            </Stack>
            <Stack>
                <Skeleton height={230} width={230} />
                <Skeleton height={20} width={230} />
            </Stack>
        </Group>
    );
}
