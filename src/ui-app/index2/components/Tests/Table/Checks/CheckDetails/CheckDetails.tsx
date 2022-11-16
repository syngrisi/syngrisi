/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line,prefer-arrow-callback */
import * as React from 'react';
import { fabric } from 'fabric';
import {
    Group,
    Paper,
    Stack,
    useMantineTheme,
    Divider,
    createStyles,
} from '@mantine/core';
import {
    useDisclosure,
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

// eslint-disable-next-line no-unused-vars
const useStyles = createStyles((theme) => ({
    zoomButtonsWrapper: {
        '@media (max-width: 1070px)': {
            display: 'none',
        },
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

    // console.log('👹💀💀💀💀👹', JSON.stringify(currentCheck));

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

    const baselineId = useMemo<string>(() => {
        if (baselineQuery.data?.results && baselineQuery.data?.results.length > 0) {
            return baselineQuery.data?.results[0]._id as string;
        }
        return '';
    }, [baselineQuery.data?.timestamp]);

    useEffect(function destroyMainView() {
        if (mainView) {
            mainView.destroyAllViews();
            mainView.canvas.clear();
            mainView.canvas.dispose();
            setMainView(null);
        }
    }, [related.relatedActiveCheckId, relatedChecksOpened]);

    // init mainView
    useEffect(() => {
        const initMV = async () => {
            fabric.Object.prototype.objectCaching = false;
            const expectedImgSrc = `${config.baseUri}/snapshoots/${currentCheck?.baselineId?.filename}?expectedImg`;
            const expectedImg = await createImageAndWaitForLoad(expectedImgSrc);

            const actual = currentCheck.actualSnapshotId || null;
            const actualImgSrc = `${config.baseUri}/snapshoots/${currentCheck?.actualSnapshotId?.filename}?actualImg`;
            const actualImg = await createImageAndWaitForLoad(actualImgSrc);

            // eslint-disable-next-line max-len
            // document.getElementById('snapshoot').style.height = `${MainView.calculateExpectedCanvasViewportAreaSize().height - 10}px`;

            const expectedImage = await imageFromUrl(expectedImg.src);
            const actualImage = await imageFromUrl((actualImg).src);

            const diffImgSrc = `${config.baseUri}/snapshoots/${currentCheck?.diffId?.filename}?diffImg`;
            const diffImage = currentCheck?.diffId?.filename ? await imageFromUrl(diffImgSrc) : null;

            await setMainView((prev: any) => {
                if (prev) return prev;
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
        setTimeout(() => {
            initMV();
        }, 10);
    }, [
        related.relatedActiveCheckId,
        relatedChecksOpened,
    ]);

    useEffect(function afterMainViewCreatedHandleRegions() {
        if (!baselineId) return;
        if (mainView) {
            mainView.getSnapshotIgnoreRegionsDataAndDrawRegions(baselineId);
        }
    }, [
        baselineQuery.data?.timestamp,
        mainView?.toString(),
    ]);

    useEffect(function initView() {
        if (mainView) {
            // setView('actual'); !!!!
            if (mainView.diffImage) {
                setTimeout(() => {
                    setView('diff');
                }, 10);
            }
        }
    }, [
        mainView?.toString(),
        // currentCheck._id,
    ]);

    // useEffect(function afterMainViewCreated() {
    // if (mainView) {
    //     zoomEvents();
    //     mouseEvents();
    //     // initial zoom
    //     fitGreatestImageIfNeeded();
    // zoomTo(mainView[greatestImage.imageName], greatestImage.dimension);
    //
    // const anotherDimension = (greatestImage.dimension === 'height') ? 'width' : 'height';
    //
    // if (mainView[greatestImage.imageName][anotherDimension] > mainView.canvas[anotherDimension]) {
    //     zoomTo(mainView[greatestImage.imageName], anotherDimension);
    // }
    //
    // // initial pan
    // setTimeout(() => {
    //     mainView.panToCanvasWidthCenter(greatestImage.imageName);
    // }, 10);
    // }
    // }, [
    //     mainView?.toString(),
    // ]);

    useEffect(function switchView() {
        if (mainView) {
            mainView.switchView(view);
            // mainView.currentView = view;
        }
    }, [view]);

    return (
        <Group style={{ width: '96vw' }} spacing={4}>

            <Stack sx={{ width: '100%' }}>
                {/* Toolbar */}
                <Group position="apart" noWrap>
                    <ScreenshotDetails mainView={mainView} check={checkData} view={view} />
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
