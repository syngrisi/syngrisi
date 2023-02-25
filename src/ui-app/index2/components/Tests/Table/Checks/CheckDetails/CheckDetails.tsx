/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line,prefer-arrow-callback,max-len,react/jsx-indent */
import * as React from 'react';
import { fabric } from 'fabric';
import {
    Group,
    Paper,
    Stack,
    useMantineTheme,
    createStyles,
    Tooltip,
    Text,
    ActionIcon,
    Loader,
} from '@mantine/core';
import {
    useDisclosure,
    useDocumentTitle,
    useLocalStorage,
} from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainView } from './Canvas/mainView';
import { imageFromUrl } from './Canvas/helpers';
import { errorMsg, log } from '../../../../../../shared/utils';
import { GenericService } from '../../../../../../shared/services';
import config from '../../../../../../config';
import { RelatedChecks } from './RelatedChecks/RelatedChecks';
import { useRelatedChecks } from './hooks/useRelatedChecks';
import { Status } from '../../../../../../shared/components/Check/Status';
import { ViewPortLabel } from '../ViewPortLabel';
import { sizes } from '../checkSizes';
import { OsIcon } from '../../../../../../shared/components/Check/OsIcon';
import { BrowserIcon } from '../../../../../../shared/components/Check/BrowserIcon';
import { getStatusMessage } from '../../../../../../shared/utils/utils';
import { useParams } from '../../../../../hooks/useParams';
import { Toolbar } from './Toolbar';

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles((theme) => ({
    zoomButtonsWrapper: {
        '@media (max-width: 1070px)': {
            display: 'none',
        },
    },
    checkPathFragment: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
}));

function onImageErrorHandler(...e: any) {
    const imgSrc = e[0].path[0].src;
    const msg = `Cannot load image: '${imgSrc}'`;
    log.error(msg, e);
    errorMsg({ error: msg });
}

function createImageAndWaitForLoad(src: string) {
    const timeout = 90000;
    const img = new Image();
    img.addEventListener('error', onImageErrorHandler);
    img.src = src;
    return Promise.race([
        new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
        }),
        new Promise((_, reject) => {
            setTimeout(
                () => reject(
                    new Error(`The image loading timeout is exceeded: '${timeout}' milliseconds, src: '${src}'`),
                ),
                timeout,
            );
        }),
    ]);
}

interface Props {
    initCheckData: any, // initially open check by clicking from table (not from related panel)
    checkQuery: any,
}

export function CheckDetails({ initCheckData, checkQuery }: Props) {
    useDocumentTitle(initCheckData?.name);

    const { query } = useParams();
    const theme = useMantineTheme();
    const { classes } = useStyles();
    const [checksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });
    const [mainView, setMainView] = useState<MainView | null>(null);

    const [relatedActiveCheckId, setRelatedActiveCheckId] = useState<string>(initCheckData._id);

    const [relatedChecksOpened, relatedChecksHandler] = useDisclosure(true);
    const related: any = useRelatedChecks(initCheckData);
    related.opened = relatedChecksOpened;
    related.handler = relatedChecksHandler;

    related.relatedActiveCheckId = relatedActiveCheckId;
    related.setRelatedActiveCheckId = setRelatedActiveCheckId;

    const currentCheck = related.relatedFlatChecksData.find((x: any) => x._id === relatedActiveCheckId) || initCheckData;

    const textLoader = <Loader size="xs" color="blue" variant="dots" />;
    const curCheck = {
        _id: currentCheck?._id,
        name: currentCheck?.name || '',
        status: currentCheck?.status || '',
        viewport: currentCheck?.viewport || '',
        os: currentCheck?.os || currentCheck?.os || '',
        browserFullVersion: currentCheck?.browserFullVersion || '',
        browserVersion: currentCheck?.browserVersion || '',
        browserName: currentCheck?.browserName || '',
        failReasons: currentCheck?.failReasons || '',
        result: currentCheck?.result || '{}',
        markedAs: currentCheck?.markedAs,
        markedByUsername: currentCheck?.markedByUsername,
        markedDate: currentCheck?.markedDate,
        app: { name: currentCheck?.app?.name || textLoader },
        suite: { name: currentCheck?.suite?.name || textLoader },
        test: {
            _id: currentCheck?.test?._id,
            name: currentCheck?.test?.name || textLoader,
        },
        actualSnapshotId: {
            createdDate: currentCheck?.actualSnapshotId?.createdDate,
            _id: currentCheck?.actualSnapshotId?._id,
        },
        baselineId: {
            createdDate: currentCheck?.baselineId?.createdDate,
            _id: currentCheck?.baselineId?._id,
        },
        diffId: { filename: currentCheck?.diffId?.filename },

        parsedResult: currentCheck?.result ? JSON.parse(currentCheck?.result) : null,
    };

    const baselineQuery = useQuery(
        [
            'baseline_by_snapshot_id',
            currentCheck?.baselineId._id,
        ],
        () => GenericService.get(
            'baselines',
            { snapshootId: currentCheck?.baselineId._id },
            {
                populate: 'app',
                limit: '1',
            },
            'baseline_by_snapshot_id',
        ),
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    );

    const statusMsg = currentCheck.status ? getStatusMessage(currentCheck) : textLoader;

    const baselineId = useMemo<string>(() => {
        if (baselineQuery.data?.results && baselineQuery.data?.results.length > 0) {
            return baselineQuery.data?.results[0]._id as string;
        }
        return '';
    }, [baselineQuery.data?.timestamp]);

    const iconsColor = useMemo(
        () => (theme.colorScheme === 'dark'
            ? theme.colors.gray[3]
            : theme.colors.dark[9]), [theme.colorScheme],
    );

    // init mainView
    useEffect(() => {
        const destroyMV = async () => {
            if (mainView) {
                await mainView.destroyAllViews();
                mainView.canvas.clear();
                mainView.canvas.dispose();
                setMainView(() => null);
            }
        };

        const initMV = async () => {
            // init
            fabric.Object.prototype.objectCaching = false;
            const expectedImgSrc = `${config.baseUri}/snapshoots/${currentCheck?.baselineId?.filename}?expectedImg`;
            const expectedImg = await createImageAndWaitForLoad(expectedImgSrc);

            const actual = currentCheck.actualSnapshotId || null;
            const actualImgSrc = `${config.baseUri}/snapshoots/${currentCheck?.actualSnapshotId?.filename}?actualImg`;
            const actualImg = await createImageAndWaitForLoad(actualImgSrc);

            // eslint-disable-next-line max-len
            document.getElementById('snapshoot').style.height = `${MainView.calculateExpectedCanvasViewportAreaSize().height - 10}px`;

            const expectedImage = await imageFromUrl(expectedImg.src);
            const actualImage = await imageFromUrl((actualImg).src);

            const diffImgSrc = `${config.baseUri}/snapshoots/${currentCheck?.diffId?.filename}?diffImg`;
            const diffImage = currentCheck?.diffId?.filename ? await imageFromUrl(diffImgSrc) : null;

            await setMainView((prev) => {
                if (prev) return prev; // for dev mode, when components render twice
                const MV = new MainView(
                    {
                        canvasId: '2d',
                        canvasElementWidth: document.getElementById('snapshoot')!.clientWidth,
                        canvasElementHeight: document.getElementById('snapshoot')!.clientHeight,
                        expectedImage,
                        actualImage,
                        diffImage,
                        actual,
                    },
                );
                // @ts-ignore
                window.mainView = MV;
                return MV;
            });
        };
        // set view
        destroyMV().then(() => initMV());
    }, [
        relatedActiveCheckId,
        relatedChecksOpened,
        query.checkId,
    ]);

    useEffect(function afterMainViewCreatedHandleRegions() {
        if (!baselineId) return;
        if (mainView) {
            mainView.getSnapshotIgnoreRegionsDataAndDrawRegions(baselineId);
        }
    }, [
        baselineQuery.data?.timestamp,
        mainView?.toString(),
        query.checkId,
    ]);

    return (
        <Group style={{ width: '96vw' }} spacing={4}>

            <Stack sx={{ width: '100%' }}>

                {/* Header */}
                <Group position="apart" sx={{ width: '98%' }} data-check-header-name={curCheck.name} noWrap>
                    <Group
                        position="left"
                        align="center"
                        spacing="xs"
                        sx={{ position: 'relative' }}
                        noWrap
                        data-test="full-check-path"
                    >
                        <Tooltip
                            label={
                                (
                                    <Group spacing={4}>
                                        {
                                            curCheck.status
                                                ? (<Status size="lg" check={curCheck} variant="filled" />)
                                                : textLoader
                                        }
                                        {statusMsg}
                                    </Group>
                                )
                            }
                            withinPortal
                        >
                            <Group align="center" data-check="status">
                                <Status size="lg" check={curCheck} variant="filled" />
                            </Group>
                        </Tooltip>

                        <Group
                            noWrap
                            spacing={0}
                        >
                            <Tooltip
                                withinPortal
                                label={`Project: ${curCheck?.app?.name}`}
                            >
                                <Text
                                    data-check="app-name"
                                    sx={{ flexShrink: 1 }}
                                    className={classes.checkPathFragment}
                                >
                                    {curCheck?.app?.name}
                                </Text>
                            </Tooltip>
                            <Tooltip
                                withinPortal
                                label={`Suite: ${curCheck?.suite?.name}`}
                            >
                                <Text
                                    data-check="suite-name"
                                    sx={{ flexShrink: 500 }}
                                    className={classes.checkPathFragment}
                                >
                                    &nbsp;/&nbsp;
                                    {curCheck?.suite?.name}
                                </Text>
                            </Tooltip>
                            <Tooltip
                                withinPortal
                                label={`Test: ${curCheck?.test?.name}`}
                            >
                                <Text
                                    data-check="test-name"
                                    sx={{ flexShrink: 5 }}
                                    className={classes.checkPathFragment}
                                >
                                    &nbsp;/&nbsp;
                                    {curCheck?.test?.name}
                                </Text>
                            </Tooltip>
                            <Tooltip
                                withinPortal
                                label={`Check: ${curCheck.name}`}

                            >
                                <Text
                                    data-check="check-name"
                                    sx={{ flexShrink: 1 }}
                                    lineClamp={1}
                                    // className={classes.checkPathFragment}
                                >
                                    &nbsp;/&nbsp;
                                    {curCheck.name || textLoader}
                                </Text>
                            </Tooltip>
                        </Group>
                    </Group>

                    <Group
                        noWrap
                        spacing="xs"
                    >
                        <Tooltip
                            label={
                                curCheck?.viewport
                            }
                            withinPortal
                        >
                            <Text lineClamp={1} sx={{ overflow: 'visible' }} data-check="viewport">
                                {
                                    curCheck?.viewport
                                        ? (
                                            <ViewPortLabel
                                                check={curCheck}
                                                color="blue"
                                                sizes={sizes}
                                                size="lg"
                                                checksViewSize={checksViewSize}
                                                fontSize="12px"
                                            />
                                        )
                                        : textLoader
                                }

                            </Text>
                        </Tooltip>

                        <Tooltip
                            data-check="os-label"
                            label={
                                curCheck?.os
                            }
                            withinPortal
                        >
                            <Group spacing={8} noWrap>
                                <ActionIcon variant="light" size={32} p={4} ml={4}>
                                    {
                                        curCheck?.os
                                            ? (
                                                <OsIcon
                                                    data-check="os-icon"
                                                    size={20}
                                                    color={iconsColor}
                                                    os={curCheck?.os}
                                                />
                                            )
                                            : textLoader
                                    }
                                </ActionIcon>
                                <Text data-check="os" size={12} lineClamp={1}>{curCheck?.os}</Text>
                            </Group>
                        </Tooltip>

                        <Tooltip
                            label={
                                curCheck?.browserFullVersion
                                    ? `${curCheck?.browserFullVersion}`
                                    : `${curCheck?.browserVersion}`
                            }
                            withinPortal
                        >
                            <Group spacing={8} noWrap>
                                <ActionIcon variant="light" size={32} p={4}>
                                    {
                                        curCheck?.browserName
                                            ? (
                                                <BrowserIcon
                                                    data-check="browser-icon"
                                                    size={20}
                                                    color={iconsColor}
                                                    browser={curCheck?.browserName}
                                                />
                                            )
                                            : textLoader
                                    }
                                </ActionIcon>
                                <Text
                                    data-check="browser"
                                    lineClamp={1}
                                    size={12}
                                >

                                    {curCheck?.browserName}
                                    {
                                        curCheck?.browserVersion
                                            ? ` - ${curCheck?.browserVersion}`
                                            : ''
                                    }
                                </Text>
                            </Group>
                        </Tooltip>
                    </Group>
                </Group>

                {/* Toolbar */}
                <Toolbar
                    mainView={mainView}
                    checkQuery={checkQuery}
                    curCheck={curCheck}
                    initCheckData={initCheckData}
                    classes={classes}
                    baselineId={baselineId}
                />

                <Group
                    spacing={4}
                    align="start"
                    sx={{ width: '100%' }}
                    noWrap
                >
                    {/* Related checks */}
                    <Group
                        align="start"
                        noWrap
                    >
                        <RelatedChecks
                            currentCheck={initCheckData}
                            related={related}
                        />
                    </Group>

                    {/* Canvas container */}
                    <Group
                        sx={
                            {
                                width: related.opened ? '90%' : '100%',
                            }
                        }
                    >
                        <Paper
                            shadow="xl"
                            withBorder
                            id="snapshoot"
                            style={
                                {
                                    backgroundColor: (
                                        theme.colorScheme === 'dark'
                                            ? theme.colors.dark[8]
                                            : theme.colors.gray[1]
                                    ),
                                    width: '100%',
                                    height: '100%',
                                }
                            }
                        >
                            <canvas style={{ width: '100%' }} id="2d" />
                        </Paper>
                    </Group>
                </Group>
            </Stack>
        </Group>
    );
}
