import React from 'react';
import { Group, Skeleton, Stack } from '@mantine/core';

export function SuitesDummySkeleton({ num, itemClass }: { num?: number, itemClass: string }) {
    return (
        <>
            {
                Object.keys(new Array(num || 6).fill('')).map(
                    (x) => (
                        <React.Fragment key={x}>
                            <Stack style={{ width: '100%' }} pl="sm" gap={0} pt={0} pb={8} className={itemClass}>
                                <Group justify="space-between">
                                    <Skeleton height={20} width="63%" radius="md" />
                                    <Skeleton height={26} mr={9} mb={-2} mt="sm" width="3%" radius="xl" />

                                </Group>
                                <Group justify="flex-end" style={{ width: '100%' }}>
                                    <Skeleton height={16} width="11%" radius="md" mr={24} />
                                </Group>
                            </Stack>
                        </React.Fragment>
                    ),
                )
            }
        </>
    );
}
