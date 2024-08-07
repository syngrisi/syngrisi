/* eslint-disable no-underscore-dangle,no-nested-ternary,react/jsx-no-useless-fragment */
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Group, Stack, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { GenericService } from '../../../../../shared/services';
import { errorMsg } from '../../../../../shared/utils';
import { ChecksSkeleton } from './ChecksSkeleton';
import { Check } from './Check';

interface Props {
    item: any,
    testUpdateQuery: any,
}

export function Checks({ item, testUpdateQuery }: Props) {
    // eslint-disable-next-line no-unused-vars
    const [checksViewMode, setChecksViewMode] = useLocalStorage({ key: 'check-view-mode', defaultValue: 'bounded' });

    const checksQuery = useQuery(
        [
            'preview_checks',
            item._id,
        ],
        () => GenericService.get(
            'checks',
            { test: item._id },
            {
                populate: 'baselineId,actualSnapshotId,diffId',
                limit: '0',
                sortBy: 'CreatedDate',
                sortOrder: -1,
            },
            'checksByIds',
        ),
        {
            refetchOnWindowFocus: false,
            onSuccess: () => {
            },
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    );

    // const checksQuery = useQuery(
    //     [
    //         'preview_checks',
    //         item._id,
    //     ],
    //     () => GenericService.get_via_post(
    //         'checks',
    //         { _id: { $in: item.checks.map((x: any) => x._id) } },
    //         {
    //             populate: 'baselineId,actualSnapshotId,diffId',
    //             limit: '0',
    //             sortBy: 'CreatedDate',
    //             sortOrder: -1,
    //         },
    //         'checksByIds',
    //     ),
    //     {
    //         refetchOnWindowFocus: false,
    //         onSuccess: () => {
    //         },
    //         onError: (e) => {
    //             errorMsg({ error: e });
    //         },
    //     },
    // );

    const ChecksContainer = (checksViewMode === 'list') ? Stack : Group;

    return (
        <>
            {
                checksQuery.isLoading
                    ? (
                        <ChecksSkeleton />
                    )
                    : (
                        checksQuery.isError
                            ? (
                                <Text color="red" size="md">
                                    Cannot load the data
                                </Text>
                            )
                            : (
                                checksQuery?.data?.results?.length < 1
                                    ? (
                                        <Text size="md">
                                            Test does not have any checks
                                        </Text>
                                    )
                                    : (
                                        <ChecksContainer p={20} align="start">
                                            {
                                                checksQuery.data.results.map(
                                                    (check) => (
                                                        <Check
                                                            key={check._id}
                                                            check={check}
                                                            checksViewMode={checksViewMode}
                                                            checksQuery={checksQuery}
                                                            testUpdateQuery={testUpdateQuery}
                                                        />
                                                    ),
                                                )
                                            }
                                        </ChecksContainer>
                                    )

                            )
                    )
            }

        </>
    );
}
