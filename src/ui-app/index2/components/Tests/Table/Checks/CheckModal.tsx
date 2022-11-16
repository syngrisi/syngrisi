/* eslint-disable prefer-arrow-callback,no-nested-ternary,no-underscore-dangle,react/jsx-one-expression-per-line,max-len */
import * as React from 'react';
import {
    ActionIcon,
    Group,
    LoadingOverlay,
    Modal,
    Stack,
    Text,
    Tooltip,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useDocumentTitle, useLocalStorage } from '@mantine/hooks';
import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IconX } from '@tabler/icons';
import { useParams } from '../../../../hooks/useParams';
import { GenericService } from '../../../../../shared/services';
import { errorMsg } from '../../../../../shared/utils';
import { CheckDetails } from './CheckDetails/CheckDetails';
import { BrowserIcon } from '../../../../../shared/components/Check/BrowserIcon';
import { OsIcon } from '../../../../../shared/components/Check/OsIcon';
import { ViewPortLabel } from './ViewPortLabel';
import { sizes } from './checkSizes';
import { Status } from '../../../../../shared/components/Check/Status';

interface Props {
    firstPageQuery: any,
}

export function CheckModal({ firstPageQuery }: Props) {
    const { query, setQuery } = useParams();
    const [checksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });
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
            // enabled: false,
            refetchOnWindowFocus: false,
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    );

    const checkData: any = useMemo(
        () => checkQuery?.data?.results[0]!,
        [JSON.stringify(checkQuery?.data?.results)],
    );
    useDocumentTitle(checkData?.name);

    const theme = useMantineTheme();
    const iconsColor = useMemo(
        () => (theme.colorScheme === 'dark'
            ? theme.colors.gray[3]
            : theme.colors.dark[9]), [theme.colorScheme],
    );

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

    const title = useMemo(() => {
        if (checkData) {
            return (
                <Group position="apart" sx={{ width: '100%' }} noWrap>
                    <Group
                        position="left"
                        align="center"
                        spacing="xs"
                        sx={{ position: 'relative' }}
                        noWrap
                    >
                        <Status size="lg" check={checkData} variant="filled" />

                        <Tooltip
                            withinPortal
                            label={
                                `Created: ${checkData.createdDate}`
                            }
                        >
                            <Text lineClamp={1}>
                                {checkData.app.name} / {checkData.suite.name} / {checkData.test.name} / {checkData?.name}
                            </Text>
                        </Tooltip>
                    </Group>

                    <Group
                        noWrap
                        spacing="xs"
                    >
                        <ViewPortLabel
                            check={checkData}
                            // color={theme.colorScheme === 'dark' ? 'gray.2' : 'gray.8'}
                            color="blue"
                            sizes={sizes}
                            size="lg"
                            checksViewSize={checksViewSize}
                            fontSize="12px"
                        />
                        {/* <Status size="lg" check={checkData} /> */}
                        <ActionIcon variant="light" size={32} p={4} ml={4}>
                            <OsIcon
                                size={20}
                                color={iconsColor}
                                os={checkData.os}
                            />
                        </ActionIcon>
                        <Text size={12} lineClamp={1}>{checkData.os}</Text>

                        <ActionIcon variant="light" size={32} p={4}>
                            <BrowserIcon
                                size={20}
                                color={iconsColor}
                                browser={checkData.browserName}
                            />
                        </ActionIcon>
                        <Text
                            lineClamp={1}
                            size={12}
                            title={
                                checkData.browserFullVersion
                                    ? `${checkData.browserFullVersion}`
                                    : ''
                            }
                        >
                            {checkData.browserName}
                            {
                                checkData.browserVersion
                                    ? ` - ${checkData.browserVersion}`
                                    : ''
                            }
                        </Text>
                    </Group>
                </Group>
            );
        }
        return '';
    }, [checkData?._id]);

    useEffect(function onCheckIdChange() {
        if (query.checkId) {
            checkModalHandlers.open();
        }
    }, [query.checkId]);

    return (
        <Modal
            opened={checkModalOpened}
            centered
            title={title}
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
