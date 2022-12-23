/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line,prefer-arrow-callback,max-len,react/jsx-indent */
import * as React from 'react';
import { fabric } from 'fabric';
import {
    Group,
    Paper,
    Stack,
    useMantineTheme,
    Divider,
    createStyles,
    Tooltip,
    Text,
    ActionIcon,
} from '@mantine/core';
import {
    useDisclosure,
    useLocalStorage,
} from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainView } from './mainView';
import { imageFromUrl } from './helpers';
import { errorMsg, log } from '../../../../../../shared/utils';
import { GenericService } from '../../../../../../shared/services';
import config from '../../../../../../config';
import { AcceptButton } from '../AcceptButton';
import { RemoveButton } from '../RemoveButton';
import { RelatedChecks } from './RelatedChecks';
import { useRelatedChecks } from './hooks/useRelatedChecks';
import { ScreenshotDetails } from './ScreenshotDetails';
import { HighlightButton } from './HighlightButton';
import { ViewSegmentedControl } from './ViewSegmentedControl';
import { ZoomToolbar } from './ZoomToolbar';
import { RegionsToolbar } from './RegionsToolbar';
import { Status } from '../../../../../../shared/components/Check/Status';
import { ViewPortLabel } from '../ViewPortLabel';
import { sizes } from '../checkSizes';
import { OsIcon } from '../../../../../../shared/components/Check/OsIcon';
import { BrowserIcon } from '../../../../../../shared/components/Check/BrowserIcon';
import { getStatusMessage } from '../../../../../../shared/utils/utils';

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
    checkData: any,
    checkQuery: any,
    firstPageQuery: any,
    closeHandler: any,
}

export function CheckDetails({ checkData, checkQuery, firstPageQuery, closeHandler }: Props) {
    const [checksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });
    const theme = useMantineTheme();
    const { classes } = useStyles();
    const [view, setView] = useState('actual');
    const [mainView, setMainView] = useState<MainView | null>(null);

    const checkResult = checkData.result ? JSON.parse(checkData.result) : null;
    const [relatedChecksOpened, relatedChecksHandler] = useDisclosure(true);
    const related: any = useRelatedChecks(checkData);
    related.opened = relatedChecksOpened;
    related.handler = relatedChecksHandler;

    const currentCheck = useMemo(
        () => related.relatedFlatChecksData.find((x: any) => x._id === related.relatedActiveCheckId) || checkData,
        [related.relatedActiveCheckId],
    );

    const baselineQuery = useQuery(
        [
            'baseline_by_snapshot_id',
            currentCheck.baselineId._id,
        ],
        () => GenericService.get(
            'baselines',
            { snapshootId: currentCheck.baselineId._id },
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

    const statusMsg = getStatusMessage(checkData);

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
        related.relatedActiveCheckId,
        relatedChecksOpened,
    ]);

    useEffect(function initView() {
        if (mainView?.diffImage) {
            setView(() => 'diff');
            return;
        }
        setView(() => 'actual');
    }, [mainView?.diffImage]);

    useEffect(function afterMainViewCreatedHandleRegions() {
        if (!baselineId) return;
        if (mainView) {
            mainView.getSnapshotIgnoreRegionsDataAndDrawRegions(baselineId);
        }
    }, [
        baselineQuery.data?.timestamp,
        mainView?.toString(),
    ]);

    useEffect(function switchView() {
        if (mainView) {
            mainView.switchView(view);
        }
    }, [view]);

    return (
        <Group style={{ width: '96vw' }} spacing={4}>

            <Stack sx={{ width: '100%' }}>

                {/* Header */}
                <Group position="apart" sx={{ width: '98%' }} data-check-header-name={currentCheck.name} noWrap>
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
                                        <Status size="lg" check={currentCheck} variant="filled" />
                                        {statusMsg}
                                    </Group>
                                )
                            }
                            withinPortal
                        >
                            <Group align="center" data-check="status">
                                <Status size="lg" check={currentCheck} variant="filled" />
                            </Group>
                        </Tooltip>

                        <Group
                            noWrap
                            spacing={0}
                            // sx={{ maxWidth: '90%' }}
                        >
                            <Tooltip
                                withinPortal
                                label={`Project: ${currentCheck.app.name}`}
                            >
                                <Text
                                    data-check="app-name"
                                    sx={{ flexShrink: 1 }}
                                    className={classes.checkPathFragment}
                                >
                                    {currentCheck.app.name}
                                </Text>
                            </Tooltip>
                            <Tooltip
                                withinPortal
                                label={`Suite: ${currentCheck.suite.name}`}
                            >
                                <Text
                                    data-check="suite-name"
                                    sx={{ flexShrink: 500 }}
                                    className={classes.checkPathFragment}
                                >
                                    &nbsp;/&nbsp;
                                    {currentCheck.suite.name}
                                </Text>
                            </Tooltip>
                            <Tooltip
                                withinPortal
                                label={`Test: ${currentCheck.test.name}`}
                            >
                                <Text
                                    data-check="test-name"
                                    sx={{ flexShrink: 5 }}
                                    className={classes.checkPathFragment}
                                >
                                    &nbsp;/&nbsp;
                                    {currentCheck.test.name}
                                </Text>
                            </Tooltip>
                            <Tooltip
                                withinPortal
                                label={`Check: ${currentCheck?.name}`}

                            >
                                <Text
                                    data-check="check-name"
                                    sx={{ flexShrink: 1 }}
                                    lineClamp={1}
                                    // className={classes.checkPathFragment}
                                >
                                    &nbsp;/&nbsp;
                                    {currentCheck?.name}
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
                                currentCheck.viewport
                            }
                            withinPortal
                        >
                            <Text lineClamp={1} sx={{ overflow: 'visible' }} data-check="viewport">
                                <ViewPortLabel
                                    check={currentCheck}
                                    // color={theme.colorScheme === 'dark' ? 'gray.2' : 'gray.8'}
                                    color="blue"
                                    sizes={sizes}
                                    size="lg"
                                    checksViewSize={checksViewSize}
                                    fontSize="12px"
                                />
                            </Text>
                        </Tooltip>

                        <Tooltip
                            data-check="os-label"
                            label={
                                currentCheck.os
                            }
                            withinPortal
                        >
                            <Group spacing={8} noWrap>
                                <ActionIcon variant="light" size={32} p={4} ml={4}>
                                    <OsIcon
                                        data-check="os-icon"
                                        size={20}
                                        color={iconsColor}
                                        os={currentCheck.os}
                                    />
                                </ActionIcon>
                                <Text data-check="os" size={12} lineClamp={1}>{currentCheck.os}</Text>
                            </Group>
                        </Tooltip>

                        <Tooltip
                            label={
                                currentCheck.browserFullVersion
                                    ? `${currentCheck.browserFullVersion}`
                                    : `${currentCheck.browserVersion}`
                            }
                            withinPortal
                        >
                            <Group spacing={8} noWrap>
                                <ActionIcon variant="light" size={32} p={4}>

                                    <BrowserIcon
                                        data-check="browser-icon"
                                        size={20}
                                        color={iconsColor}
                                        browser={currentCheck.browserName}
                                    />
                                </ActionIcon>
                                <Text
                                    data-check="browser"
                                    lineClamp={1}
                                    size={12}
                                >

                                    {currentCheck.browserName}
                                    {
                                        currentCheck.browserVersion
                                            ? ` - ${currentCheck.browserVersion}`
                                            : ''
                                    }
                                </Text>
                            </Group>
                        </Tooltip>
                    </Group>
                </Group>

                {/* Toolbar */}
                <Group position="apart" noWrap data-check="toolbar">
                    <ScreenshotDetails mainView={mainView} check={currentCheck} view={view} />
                    <Group spacing="sm" noWrap>
                        <Group
                            spacing={4}
                            className={classes.zoomButtonsWrapper}
                            position="center"
                            align="center"
                            noWrap
                        >
                            <ZoomToolbar mainView={mainView as MainView} view={view} />
                        </Group>

                        <Divider orientation="vertical" />

                        <ViewSegmentedControl view={view} setView={setView} currentCheck={currentCheck} />

                        <Divider orientation="vertical" />

                        <HighlightButton
                            mainView={mainView as MainView}
                            disabled={!(view === 'diff' && parseFloat(checkResult.rawMisMatchPercentage) < 5)}
                        />
                        <Divider orientation="vertical" />

                        <RegionsToolbar mainView={mainView} baselineId={baselineId} view={view} />

                        <Divider orientation="vertical" />
                        <AcceptButton
                            check={currentCheck}
                            checksQuery={checkQuery}
                            size={24}
                            testUpdateQuery={firstPageQuery}
                        />

                        <RemoveButton
                            check={currentCheck}
                            checksQuery={checkQuery}
                            size={30}
                            testUpdateQuery={firstPageQuery}
                            closeHandler={closeHandler}
                        />
                    </Group>
                </Group>

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
                            check={currentCheck}
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
