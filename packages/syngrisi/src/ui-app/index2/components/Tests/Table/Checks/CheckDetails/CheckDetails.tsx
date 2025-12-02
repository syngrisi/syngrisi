/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line,prefer-arrow-callback,max-len,react/jsx-indent */
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { createStyles, Group, Loader, Stack } from '@mantine/core';
import { useDisclosure, useDocumentTitle } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { MainView } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/mainView';
import { createImageAndWaitForLoad, imageFromUrl } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/helpers';
import { errorMsg } from '@shared/utils';
import { GenericService, imagePreloadService } from '@shared/services';
import config from '@config';
import { RelatedChecksContainer } from '@index/components/Tests/Table/Checks/CheckDetails/RelatedChecks/RelatedChecksContainer';
import { useParams } from '@hooks/useParams';
import { Toolbar } from '@index/components/Tests/Table/Checks/CheckDetails/Toolbar/Toolbar';
import { Header } from '@index/components/Tests/Table/Checks/CheckDetails/Header';
import { Canvas } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/Canvas';
import { log } from '@shared/utils/Logger';

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

interface Props {
    initCheckData: any, // initially open check by clicking from table (not from related panel)
    checkQuery: any,
    closeHandler: any,
    relatedRendered?: boolean,
    testList?: any[],
}

export function CheckDetails({
    initCheckData,
    checkQuery,
    closeHandler,
    relatedRendered = true,
    testList = [],
}: Props) {
    useDocumentTitle(initCheckData?.name);
    const canvasElementRef = useRef(null);
    const { query, setQuery } = useParams();
    const { classes } = useStyles();
    const [mainView, setMainView] = useState<MainView | null>(null);

    const [relatedActiveCheckId, setRelatedActiveCheckId] = useState<string>(initCheckData._id);
    const [relatedChecksOpened, relatedChecksHandler] = useDisclosure(relatedRendered);

    const currentCheck = initCheckData;
    const textLoader = <Loader size="xs" color="blue" variant="dots" />;

    useEffect(() => {
        if (initCheckData?._id) {
            setRelatedActiveCheckId(initCheckData._id);
        }
    }, [initCheckData?._id]);

    const currentCheckSafe = {
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
        // Add enriched flags for AcceptButton icon state
        isCurrentlyAccepted: currentCheck?.isCurrentlyAccepted,
        wasAcceptedEarlier: currentCheck?.wasAcceptedEarlier,
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
                includeUsage: 'true',
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

    const usageCount = useMemo<number>(() => {
        if (baselineQuery.data?.results && baselineQuery.data?.results.length > 0) {
            return baselineQuery.data?.results[0].usageCount || 0;
        }
        return 0;
    }, [baselineQuery.data?.timestamp]);

    // Navigation Logic
    const siblingChecksQuery = useQuery(
        ['sibling_checks', currentCheck?.test?._id],
        () => GenericService.get(
            'checks',
            { test: currentCheck?.test?._id },
            {
                limit: '0',
                sortBy: 'CreatedDate',
                sortOrder: -1,
            },
            'sibling_checks_for_nav'
        ),
        {
            enabled: !!currentCheck?.test?._id,
            refetchOnWindowFocus: false,
        }
    );
    const siblingChecks = siblingChecksQuery.data?.results || [];
    const currentCheckIndex = siblingChecks.findIndex((c: any) => c._id === currentCheck._id);
    const currentTestIndex = testList.findIndex((t: any) => (t.id || t._id) === currentCheck?.test?._id);

    const handleNavigateCheck = (direction: 'prev' | 'next') => {
        if (!siblingChecks.length) return;
        const targetIndex = direction === 'prev' ? currentCheckIndex - 1 : currentCheckIndex + 1;
        if (targetIndex >= 0 && targetIndex < siblingChecks.length) {
            setQuery({ checkId: siblingChecks[targetIndex]._id });
        }
    };

    const handleNavigateTest = async (direction: 'prev' | 'next') => {
        if (!testList || !testList.length) return;
        const targetTestIndex = direction === 'prev' ? currentTestIndex - 1 : currentTestIndex + 1;

        if (targetTestIndex >= 0 && targetTestIndex < testList.length) {
            const targetTest = testList[targetTestIndex];
            const targetTestId = targetTest.id || targetTest._id;

            const checks = await GenericService.get(
                'checks',
                { test: targetTestId },
                {
                    limit: '1',
                    sortBy: 'CreatedDate',
                    sortOrder: -1,
                },
                'first_check_for_nav'
            );

            if (checks.results && checks.results.length > 0) {
                setQuery({ checkId: checks.results[0]._id });
            }
        }
    };

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

            // Build image URLs (without query params for cache lookup)
            const expectedImgSrcBase = `${config.baseUri}/snapshoots/${currentCheck?.baselineId?.filename}`;
            const actualImgSrcBase = `${config.baseUri}/snapshoots/${currentCheck?.actualSnapshotId?.filename}`;
            const diffImgSrcBase = currentCheck?.diffId?.filename
                ? `${config.baseUri}/snapshoots/${currentCheck?.diffId?.filename}`
                : null;

            // Try to get from preload cache first, fallback to loading
            let expectedImg = imagePreloadService.getPreloadedImage(expectedImgSrcBase);
            let actualImg = imagePreloadService.getPreloadedImage(actualImgSrcBase);

            const cacheHit = !!(expectedImg && actualImg);
            if (cacheHit) {
                log.debug('[CheckDetails] Using preloaded images from cache');
            } else {
                log.debug('[CheckDetails] Loading images (cache miss)');
            }

            // Load images that are not in cache
            if (!expectedImg) {
                const expectedImgSrc = `${expectedImgSrcBase}?expectedImg`;
                expectedImg = await createImageAndWaitForLoad(expectedImgSrc) as HTMLImageElement;
            }

            const actual = currentCheck.actualSnapshotId || null;
            if (!actualImg) {
                const actualImgSrc = `${actualImgSrcBase}?actualImg`;
                actualImg = await createImageAndWaitForLoad(actualImgSrc) as HTMLImageElement;
            }

            canvasElementRef.current.style.height = `${MainView.calculateExpectedCanvasViewportAreaSize().height - 10}px`;

            const expectedImage = await imageFromUrl(expectedImg.src);
            const actualImage = await imageFromUrl(actualImg.src);

            // Handle diff image
            let diffImage = null;
            if (diffImgSrcBase) {
                const cachedDiff = imagePreloadService.getPreloadedImage(diffImgSrcBase);
                if (cachedDiff) {
                    diffImage = await imageFromUrl(cachedDiff.src);
                } else {
                    const diffImgSrc = `${diffImgSrcBase}?diffImg`;
                    diffImage = await imageFromUrl(diffImgSrc);
                }
            }

            setMainView((prev) => {
                if (prev) return prev; // for dev mode, when components render twice
                const MV = new MainView(
                    {
                        canvasId: '2d',
                        canvasElementWidth: canvasElementRef.current?.clientWidth,
                        canvasElementHeight: canvasElementRef.current?.clientHeight,
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
        mainView?.toString(),
        baselineId,
    ]);

    return (
        <Group style={{ width: '96vw' }} spacing={4}>
            <Stack sx={{ width: '100%' }}>
                {/* Header */}
                <Header
                    classes={classes}
                    currentCheck={currentCheckSafe}
                />
                {/* Toolbar */}
                <Toolbar
                    mainView={mainView}
                    checkQuery={checkQuery}
                    curCheck={currentCheckSafe}
                    initCheckData={initCheckData}
                    classes={classes}
                    baselineId={baselineId}
                    usageCount={usageCount}
                    closeHandler={closeHandler}
                    onNavigateCheck={handleNavigateCheck}
                    onNavigateTest={handleNavigateTest}
                    isFirstCheck={currentCheckIndex <= 0}
                    isLastCheck={currentCheckIndex === siblingChecks.length - 1}
                    isFirstTest={currentTestIndex <= 0}
                    isLastTest={currentTestIndex === testList.length - 1}
                />

                <Group
                    spacing={4}
                    align="start"
                    sx={{ width: '100%' }}
                    noWrap
                >
                    {/* Related checks */}
                    {relatedRendered && (
                        <RelatedChecksContainer
                            currentCheck={initCheckData}
                            opened={relatedChecksOpened}
                            handler={relatedChecksHandler}
                            activeCheckId={relatedActiveCheckId}
                            setActiveCheckId={setRelatedActiveCheckId}
                        />
                    )}

                    {/* Canvas container */}
                    <Canvas
                        canvasElementRef={canvasElementRef}
                        isRelatedOpened={relatedRendered && relatedChecksOpened}
                    />
                </Group>
            </Stack>
        </Group>
    );
}
