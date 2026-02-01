/* eslint-disable prefer-arrow-callback,no-nested-ternary,no-underscore-dangle,react/jsx-one-expression-per-line,max-len */
import * as React from 'react';
import {
    ActionIcon,
    Group,
    LoadingOverlay,
    Modal,
    Stack,
    Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IconX } from '@tabler/icons-react';
import { useParams } from '@hooks/useParams';
import { GenericService } from '@shared/services';
import { errorMsg } from '@shared/utils';
import { CheckDetails } from '@index/components/Tests/Table/Checks/CheckDetails/CheckDetails';

interface Props {
    relatedRendered?: boolean;
    apikey?: string;
    testList?: any[];
}

export function CheckModal({ relatedRendered = true, apikey, testList = [] }: Props) {
    const { query, setQuery } = useParams();
    const [checkModalOpened, checkModalHandlers] = useDisclosure(false);
    const pollCountRef = useRef(0);

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
            enabled: checkModalOpened,
            refetchInterval: (data) => {
                const check = data?.results?.[0];
                if (check && !check.diffId && check.status[0] !== 'new' && check.status[0] !== 'passed') {
                    pollCountRef.current += 1;
                    const interval = Math.min(2000 * Math.pow(1.5, pollCountRef.current - 1), 10000);
                    return interval;
                }
                pollCountRef.current = 0;
                return false;
            },
            refetchOnWindowFocus: false,
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    );

    const checkData = checkQuery?.data?.results[0]!;
    return (
        <Modal
            className="modal"
            opened={checkModalOpened}
            centered
            size="auto"
            onClose={closeHandler}
            sx={{ marginTop: -25 }}
            styles={{ title: { width: '100%', paddingRight: 35 } }}
            withCloseButton={false}
        >
            {/* Close Button */}
            <ActionIcon
                data-test="close-check-detail-icon"
                style={{ position: 'fixed', right: 10, top: 10 }}
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
                                <Text color="red">Error load the check data</Text>
                            </Stack>
                        )
                        : checkData
                            ? (
                                <CheckDetails
                                    initCheckData={checkData}
                                    checkQuery={checkQuery}
                                    closeHandler={closeHandler}
                                    relatedRendered={relatedRendered}
                                    testList={testList}
                                    apikey={apikey}
                                />
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
