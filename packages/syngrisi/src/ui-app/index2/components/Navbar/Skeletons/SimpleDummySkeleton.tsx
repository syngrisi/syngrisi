import React from 'react';
import { Group, Skeleton, Stack } from '@mantine/core';

export default function SimpleDummySkeleton({ num, itemClass }: { num?: number, itemClass: string }) {
    return (
        <>
            {
                Object.keys(new Array(num).fill('')).map(
                    (x) => (
                        <React.Fragment key={x}>
                            <Stack pb={6} className={itemClass} style={{ width: '100%' }} pl="sm">
                                <Group>
                                    <Skeleton height={30} mt="sm" width="10%" radius="xl" />
                                    <Skeleton height={20} ml={-5} mt="sm" width="55%" radius="sm" />
                                </Group>
                            </Stack>
                        </React.Fragment>
                    ),
                )
            }
        </>
    );
}
