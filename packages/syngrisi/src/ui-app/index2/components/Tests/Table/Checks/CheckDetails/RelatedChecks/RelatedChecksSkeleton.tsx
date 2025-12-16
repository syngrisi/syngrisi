import * as React from 'react';
import { Group, Skeleton, Stack } from '@mantine/core';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface Props {
    num: number
    infinityQuery: any
}

export function RelatedChecksSkeleton({ num, infinityQuery }: Props) {
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && infinityQuery) {
            infinityQuery.fetchNextPage();
        }
    }, [inView]);

    return (
        <Stack ref={ref}>
            {
                (infinityQuery === null || infinityQuery.hasNextPage)
                && (
                    Object.keys(new Array(num).fill('')).map(
                        (x) => (
                            <React.Fragment key={x}>
                                <Group style={{ width: '100%' }} pl="xs" pr="md">
                                    <Skeleton height={120} mt="sm" width="125px" radius="sm" />
                                </Group>
                            </React.Fragment>
                        ),
                    ))
            }
        </Stack>
    );
}
