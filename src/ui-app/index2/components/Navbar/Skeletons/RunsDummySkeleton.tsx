import React from 'react';
import { Group, Skeleton } from '@mantine/core';

function RunsDummySkeleton({ num }: { num?: number }) {
    return (
        <>
            {
                Object.keys(new Array(num || 6).fill('')).map(
                    (x) => (
                        <React.Fragment key={x}>
                            <Group style={{ width: '100%' }} pl="sm">
                                <Skeleton height={20} mt="sm" width="73%" radius="sm" />
                                <Skeleton height={30} mt="sm" width="10%" radius="xl" />
                            </Group>
                        </React.Fragment>
                    ),
                )
            }
        </>
    );
}

export default RunsDummySkeleton;
