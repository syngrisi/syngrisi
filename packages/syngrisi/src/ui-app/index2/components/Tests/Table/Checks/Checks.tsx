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
import { parseTriageFilter, checkMatchesTriage } from '@index/components/Tests/Table/triageFilter';
import { useSimilar } from '@hooks/useSimilar';

interface Props {
    item: any,
    testUpdateQuery: any,
}

export function Checks({ item, testUpdateQuery }: Props) {
    // eslint-disable-next-line no-unused-vars
    const [checksViewMode, setChecksViewMode] = useLocalStorage({ key: 'check-view-mode', defaultValue: 'bounded' });
    const { query } = useParams();
    // "Find similar checks": filter to the ranked similar set and order/badge checks by similarity.
    const { similarTo, ids, scoreById } = useSimilar();
    const similarActive = !!(similarTo && ids.length);
    const effectiveCheckFilter = similarActive ? { ...query.checkFilter, _idIn: ids } : query.checkFilter;
    // Optional AI-triage filter (verdict(s) / min confidence / reason substring). Applied client-side
    // so the checks query key/cache stay unchanged (accept/remove optimistic updates keep working).
    const triage = parseTriageFilter(effectiveCheckFilter);
    const hasTriageFilter = triage.active;

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
        // Live verdict updates: while any check is awaiting AI analysis (triage.pending),
        // poll so the verdict badge updates without a reload; stop once all are classified.
        refetchInterval: (query: any) => {
            const results = query.state.data?.results || [];
            return results.some((c: any) => c?.triage?.pending === true) ? 4000 : false;
        },
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
    let checks = hasTriageFilter ? allChecks.filter((c: any) => checkMatchesTriage(c, triage)) : allChecks;
    // Order the similar set best-first by similarity score.
    if (similarActive) {
        checks = [...checks].sort(
            (a: any, b: any) => (scoreById.get(String(b._id)) ?? 0) - (scoreById.get(String(a._id)) ?? 0),
        );
    }
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
                                                            similarityScore={similarActive ? scoreById.get(String(check._id)) : undefined}
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
