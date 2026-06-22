/* eslint-disable no-underscore-dangle,no-nested-ternary,react/jsx-no-useless-fragment */
import * as React from 'react';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Group, Stack, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { GenericService } from '@shared/services';

import { ChecksSkeleton } from '@index/components/Tests/Table/Checks/ChecksSkeleton';
import { Check } from '@index/components/Tests/Table/Checks/Check';
import { useImagePreloadBatch } from '@shared/hooks';
import { useParams } from '@hooks/useParams';

interface Props {
    item: any,
    testUpdateQuery: any,
}

export function Checks({ item, testUpdateQuery }: Props) {
    // eslint-disable-next-line no-unused-vars
    const [checksViewMode, setChecksViewMode] = useLocalStorage({ key: 'check-view-mode', defaultValue: 'bounded' });
    const { query } = useParams();
    // Optional AI-triage filter (verdict / min confidence / reason substring). Applied client-side so
    // the checks query key/cache stay unchanged (accept/remove optimistic updates keep working).
    const cf: any = (query.checkFilter && typeof query.checkFilter === 'object') ? query.checkFilter : {};
    const verdictFilter: string | undefined = cf['triage.verdict'];
    const minConfidence: number | undefined = typeof cf.minConfidence === 'number' ? cf.minConfidence : undefined;
    const reasonContains: string | undefined = (typeof cf.reasonContains === 'string' && cf.reasonContains) ? cf.reasonContains.toLowerCase() : undefined;
    const hasTriageFilter = !!(verdictFilter || typeof minConfidence === 'number' || reasonContains);
    const matchesTriageFilter = (c: any) => {
        const t = c?.triage;
        if (!t) return false;
        if (verdictFilter && t.verdict !== verdictFilter) return false;
        if (typeof minConfidence === 'number' && !(typeof t.confidence === 'number' && t.confidence >= minConfidence)) return false;
        if (reasonContains && !(String(t.reason || '').toLowerCase().includes(reasonContains))) return false;
        return true;
    };

    const checksQuery = useQuery({
        queryKey: [
            'preview_checks',
            item._id,
        ],
        queryFn: () => GenericService.get(
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
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000,
    });

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

    // Preload images for all checks when data is loaded
    const allChecks = checksQuery?.data?.results || [];
    const checks = hasTriageFilter ? allChecks.filter(matchesTriageFilter) : allChecks;
    useImagePreloadBatch(checks, {
        enabled: checks.length > 0,
        priority: 'medium',
        preloadCount: 30, // Preload first 30 checks (30 * 3 images = 90)
    });

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
                                <Text c="red" size="md">
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
                                        <ChecksContainer
                                            pt={6}
                                            pb={10}
                                            px={12}
                                            gap="md"
                                            align="start"
                                            data-test-checks-ready="true"
                                        >
                                            {
                                                checks.map(
                                                    (check: any) => (
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
