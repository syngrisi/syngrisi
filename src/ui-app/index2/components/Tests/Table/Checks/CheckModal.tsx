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
import { useDisclosure, useDocumentTitle } from '@mantine/hooks';
import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IconX } from '@tabler/icons';
import { useParams } from '../../../../hooks/useParams';
import { GenericService } from '../../../../../shared/services';
import { errorMsg } from '../../../../../shared/utils';
import { CheckDetails } from './CheckDetails/CheckDetails';

interface Props {
    firstPageQuery: any,
}

export function CheckModal({ firstPageQuery }: Props) {
    const { query, setQuery } = useParams();
    const [checkModalOpened, checkModalHandlers] = useDisclosure(false);

    const closeHandler = () => {
        checkModalHandlers.close();
        setQuery({ checkId: null });
    };
    const { checkId } = query;
    const checkQuery = useQuery(
        [
            'check_for_modal',
            checkId,
        ],
        () => GenericService.get(
            'checks',
            { _id: checkId },
            {
                populate: 'baselineId,actualSnapshotId,diffId,test,suite,app',
                limit: '1',
            },
            'check_for_modal',
        ),
        {
            enabled: checkModalOpened,
            refetchOnWindowFocus: false,
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    );

    const checkData: any = useMemo(
        () => checkQuery?.data?.results[0]!,
        [checkQuery?.data?.timestamp],
    );
    useDocumentTitle(checkData?.name);

    const keyEvents = () => {
        document.addEventListener('keydown',
            function keyHandler(event: any) {
                console.log(event.code);
            });
    };

    function mouseEvents() {
        // mainView.canvas.on(
        //     'mouse:move', (e: any) => {
        //         if (!e.e.ctrlKey) return;
        //         const mEvent = e.e;
        //     },
        // );
    }

    useEffect(function oneTime() {
        keyEvents();
        mouseEvents();
    }, []);

    useEffect(function onCheckIdChange() {
        if (query.checkId) {
            checkModalHandlers.open();
        }
    }, [query.checkId]);

    return (
        <Modal
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
                checkQuery.isLoading
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
                                    checkData={checkData}
                                    checkQuery={checkQuery}
                                    firstPageQuery={firstPageQuery}
                                    closeHandler={closeHandler}
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
