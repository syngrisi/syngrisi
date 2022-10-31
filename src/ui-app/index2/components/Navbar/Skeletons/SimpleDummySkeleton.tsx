import React from 'react';
import { Group, Skeleton } from '@mantine/core';

export default function SimpleDummySkeleton({ num = 6 }: { num: number }) {
    return (
        <>
            {
                Object.keys(new Array(num).fill('')).map(
                    (x) => (
                        <React.Fragment key={x}>
                            <Group style={{ width: '100%' }} pl="sm">
                                <Skeleton height={20} mt="sm" width="80%" radius="sm" />
                            </Group>
                        </React.Fragment>
                    ),
                )
            }
        </>
    );
}
