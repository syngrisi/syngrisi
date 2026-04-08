/* eslint-disable prefer-arrow-callback,no-nested-ternary,no-underscore-dangle,react/jsx-one-expression-per-line,max-len */
import * as React from 'react';
import {
    ActionIcon,
    Group,
    Loader,
    LoadingOverlay,
    Modal,
    Stack,
    Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IconX } from '@tabler/icons-react';
import { useParams } from '@hooks/useParams';
import { GenericService } from '@shared/services';


const CheckDetails = lazy(() => import('@index/components/Tests/Table/Checks/CheckDetails/CheckDetails').then(m => ({ default: m.CheckDetails })));

interface Props {
    relatedRendered?: boolean;
    apikey?: string;
    testList?: any[];
}

export function CheckModal({ relatedRendered = true, apikey, testList = [] }: Props) {
    const { query, setQuery } = useParams();
    const [checkModalOpened, checkModalHandlers] = useDisclosure(false);
    const pollCountRef = useRef(0);
    const queryClient = useQueryClient();

    const [initCheckId, setInitCheckId] = useState<string>('');
    useEffect(function onCheckIdChange() {
        if (query.checkId && query.modalIsOpen === 'true') {
            setInitCheckId(query.checkId);
            checkModalHandlers.open();
        }
    }, [query.modalIsOpen, query.checkId]);

    const closeHandler = () => {
        checkModalHandlers.close();
        setQuery({ checkId: undefined });
        setQuery({ modalIsOpen: undefined });
        setInitCheckId('');
    };

    const cachedPreviewCheck = React.useMemo(() => {
        if (!initCheckId) return undefined;

        const cachedModalData = queryClient.getQueryData(['check_for_modal', initCheckId]) as any;
        const cachedModalCheck = cachedModalData?.results?.[0];
        if (cachedModalCheck) return cachedModalCheck;

        const previewQueries = queryClient.getQueriesData({ queryKey: ['preview_checks'] });
        for (const [, data] of previewQueries) {
            const check = (data as any)?.results?.find?.((item: any) => item?._id === initCheckId);
            if (check) return check;
        }

        return undefined;
    }, [initCheckId, queryClient]);

    const cachedSiblingChecks = React.useMemo(() => {
        const testId = cachedPreviewCheck?.test?._id || cachedPreviewCheck?.test;
        if (!testId) return [];

        const previewQueries = queryClient.getQueriesData({ queryKey: ['preview_checks'] });
        for (const [queryKey, data] of previewQueries) {
            if ((queryKey as any[])?.[1] !== testId) continue;
            return (data as any)?.results || [];
        }

        return [];
    }, [cachedPreviewCheck?._id, queryClient]);

    const hasPopulatedEntity = (entity: any) => Boolean(entity && typeof entity === 'object' && (entity._id || entity.id));
    const hasNamedEntity = (entity: any) => Boolean(hasPopulatedEntity(entity) && entity.name);
    const hasSnapshotData = (snapshot: any) => Boolean(hasPopulatedEntity(snapshot) && snapshot.filename);

    const needsCheckRefetch = (check: any) => {
        if (!check) return true;
        if (!hasNamedEntity(check.test) || !hasNamedEntity(check.suite) || !hasNamedEntity(check.app)) return true;
        if (!hasSnapshotData(check.baselineId) || !hasSnapshotData(check.actualSnapshotId)) return true;
        if (check.diffId && !hasSnapshotData(check.diffId)) return true;
        if (!check.diffId && check.status?.[0] !== 'new' && check.status?.[0] !== 'passed') return true;
        return false;
    };

    const hasHydratedCachedCheck = Boolean(cachedPreviewCheck) && !needsCheckRefetch(cachedPreviewCheck);
    const shouldFetchCheck = checkModalOpened && needsCheckRefetch(cachedPreviewCheck);

    const checkQuery = useQuery(
        {
            queryKey: [
                'check_for_modal',
                initCheckId,
            ],
            queryFn: () => GenericService.get(
                'checks',
                { _id: initCheckId },
                {
                    populate: 'baselineId,actualSnapshotId,diffId,test,suite,app',
                    limit: '1',
                    share: apikey,
                },
                'initial_check_for_check_details_modal',
            ),
            enabled: shouldFetchCheck,
            initialData: hasHydratedCachedCheck
                ? {
                    results: [cachedPreviewCheck],
                    page: 1,
                    limit: 1,
                    totalPages: 1,
                    totalResults: 1,
                    timestamp: Date.now(),
                }
                : undefined,
            staleTime: hasHydratedCachedCheck ? 10 * 1000 : 0,
            refetchInterval: (query) => {
                const check = query.state.data?.results?.[0];
                if (check && !check.diffId && check.status[0] !== 'new' && check.status[0] !== 'passed') {
                    pollCountRef.current += 1;
                    const interval = Math.min(2000 * Math.pow(1.5, pollCountRef.current - 1), 10000);
                    return interval;
                }
                pollCountRef.current = 0;
                return false;
            },
            refetchOnWindowFocus: false,
        },
    );

    const checkData = checkQuery?.data?.results[0]!;
    return (
        <Modal
            className="modal"
            opened={checkModalOpened}
            centered
            size="calc(100vw - 15px)"
            onClose={closeHandler}
            style={{ marginTop: 43 }}
            styles={{
                inner: {
                    padding: '78px 7px 48px',
                },
                title: { width: '100%', paddingRight: 35 },
                content: {
                    padding: '20px 20px 10px',
                    maxHeight: 'none',
                },
                body: {
                    padding: 0,
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                },
            }}
            withCloseButton={false}
        >
            {/* Close Button */}
            <ActionIcon
                data-test="close-check-detail-icon"
                style={{ position: 'fixed', right: 10, top: 10 }}
                variant="transparent"
                color="gray"
                onClick={
                    () => {
                        closeHandler();
                        checkModalHandlers.close();
                    }
                }
            >
                <IconX size={32} />
            </ActionIcon>

            {
                checkQuery.isLoading && !checkData
                    ? (
                        <Stack mt={60}>
                            <LoadingOverlay visible />
                            <Text>Loading the data</Text>
                        </Stack>
                    )
                    : checkQuery.isError
                        ? (
                            <Stack mt={40}>
                                <Text c="red">Error load the check data</Text>
                            </Stack>
                        )
                        : checkData
                            ? (
                                <Suspense fallback={<Stack mt={60}><LoadingOverlay visible /><Text>Loading check details...</Text></Stack>}>
                                    <CheckDetails
                                        key={checkData._id}
                                        initCheckData={checkData}
                                        checkQuery={checkQuery}
                                        closeHandler={closeHandler}
                                        relatedRendered={relatedRendered}
                                        testList={testList}
                                        apikey={apikey}
                                        initialSiblingChecks={cachedSiblingChecks}
                                    />
                                </Suspense>
                            )
                            : (
                                <Group mt={60}>
                                    Empty check data
                                </Group>
                            )

            }
        </Modal>
    );
}
