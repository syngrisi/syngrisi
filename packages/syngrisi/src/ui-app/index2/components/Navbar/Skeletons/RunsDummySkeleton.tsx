import React from 'react';
import { Group, Skeleton, Stack } from '@mantine/core';

export function RunsDummySkeleton({ num, itemClass }: { num?: number, itemClass: string }) {
    return (
        <>
            {
                Object.keys(new Array(num || 6).fill('')).map(
                    (x) => (
                        <React.Fragment key={x}>
                            <Stack style={{ width: '100%' }} pl="sm" spacing={0} pt={0} pb={8} className={itemClass}>
                                <Group>
                                    <Skeleton height={20} mt="sm" width="63%" radius="md" />
                                    <Skeleton height={30} mt="sm" ml={32} width="10%" radius="xl" />
                                    <Skeleton height={26} mb={-6} mt="sm" width="3%" radius="xl" />
                                </Group>
                                <Group position="right" style={{ width: '100%' }}>
                                    <Skeleton height={14} width="13%" radius="md" mr={74} />
                                </Group>
                            </Stack>
                        </React.Fragment>
                    ),
                )
            }
        </>
    );
}
