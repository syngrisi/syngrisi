/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line,prefer-arrow-callback,max-len,react/jsx-indent */
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { createStyles, Group, Loader, Stack } from '@mantine/core';
import { useDisclosure, useDocumentTitle } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { MainView } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/mainView';
import { createImageAndWaitForLoad, imageFromUrl, imageFromElement } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/helpers';
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
    }, [baselineQuery.data?.results]);

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
    const siblingChecks = useMemo(() => {
        const checks = siblingChecksQuery.data?.results || [];
        const getTimestamp = (item: any) => {
            const value = item?.createdDate ?? item?.CreatedDate;
            const parsed = Number(new Date(value).getTime());
            if (Number.isFinite(parsed)) {
                return parsed;
            }
            return 0;
        };
        return [...checks].sort((a, b) => {
            const timeA = getTimestamp(a);
            const timeB = getTimestamp(b);
            if (timeA === timeB) {
                const idA = String(a?._id ?? a?.id ?? '');
                const idB = String(b?._id ?? b?.id ?? '');
                return idA.localeCompare(idB);
            }
            return timeA - timeB;
        });
    }, [siblingChecksQuery.data?.results]);
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

    // Helper function to load images
    const loadImages = async () => {
        // Build image URLs (without query params for cache lookup)
        const expectedImgSrcBase = `${config.baseUri}/snapshoots/${currentCheck?.baselineId?.filename}`;
        const actualImgSrcBase = `${config.baseUri}/snapshoots/${currentCheck?.actualSnapshotId?.filename}`;
        const diffImgSrcBase = currentCheck?.diffId?.filename
            ? `${config.baseUri}/snapshoots/${currentCheck?.diffId?.filename}`
            : null;

        // Try to get from preload cache first, fallback to loading
        let expectedImg = imagePreloadService.getPreloadedImage(expectedImgSrcBase);
        let actualImg = imagePreloadService.getPreloadedImage(actualImgSrcBase);

        const expectedCacheHit = !!expectedImg;
        const actualCacheHit = !!actualImg;

        if (expectedCacheHit && actualCacheHit) {
            log.debug('[CheckDetails] Using preloaded images from cache');
        } else {
            log.debug(`[CheckDetails] Loading images (expected: ${expectedCacheHit ? 'HIT' : 'MISS'}, actual: ${actualCacheHit ? 'HIT' : 'MISS'})`);
        }

        // Load images that are not in cache
        if (!expectedImg) {
            expectedImg = await createImageAndWaitForLoad(expectedImgSrcBase) as HTMLImageElement;
            imagePreloadService.storeImage(expectedImgSrcBase, expectedImg);
        }

        if (!actualImg) {
            actualImg = await createImageAndWaitForLoad(actualImgSrcBase) as HTMLImageElement;
            imagePreloadService.storeImage(actualImgSrcBase, actualImg);
        }

        // Convert HTMLImageElement to fabric.Image
        const expectedImage = imageFromElement(expectedImg);
        const actualImage = imageFromElement(actualImg);

        // Handle diff image
        let diffImage: fabric.Image | null = null;
        if (diffImgSrcBase) {
            let diffImg = imagePreloadService.getPreloadedImage(diffImgSrcBase);
            if (diffImg) {
                log.debug('[CheckDetails] Using preloaded diff image from cache');
                diffImage = imageFromElement(diffImg);
            } else {
                log.debug('[CheckDetails] Loading diff image (cache miss)');
                diffImg = await createImageAndWaitForLoad(diffImgSrcBase) as HTMLImageElement;
                imagePreloadService.storeImage(diffImgSrcBase, diffImg);
                diffImage = imageFromElement(diffImg);
            }
        }

        return { expectedImage, actualImage, diffImage };
    };

    // Initialize mainView once on mount
    useEffect(() => {
        let isMounted = true;

        const initMV = async () => {
            fabric.Object.prototype.objectCaching = false;

            const { expectedImage, actualImage, diffImage } = await loadImages();
            if (!isMounted) return;

            const actual = currentCheck.actualSnapshotId || null;
            canvasElementRef.current.style.height = `${MainView.calculateExpectedCanvasViewportAreaSize().height - 10}px`;

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
            // @ts-ignore - set window.mainView for E2E tests
            window.mainView = MV;
            setMainView(MV);
        };

        initMV();

        // Cleanup on unmount
        return () => {
            isMounted = false;
            setMainView((prev) => {
                if (prev) {
                    prev.destroyAllViews();
                    prev.canvas.clear();
                    prev.canvas.dispose();
                }
                return null;
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only on mount/unmount

    // Update images when check changes (navigation) - reuse existing canvas
    useEffect(() => {
        if (!mainView || !currentCheck?._id) return;

        let isMounted = true;

        const updateCheckImages = async () => {
            log.debug('[CheckDetails] Navigation: updating images without recreating canvas');

            const { expectedImage, actualImage, diffImage } = await loadImages();
            if (!isMounted) return;

            const actual = currentCheck.actualSnapshotId || null;

            // Check if canvas needs resize (different viewport)
            const newWidth = canvasElementRef.current?.clientWidth;
            const newHeight = canvasElementRef.current?.clientHeight;
            if (newWidth && newHeight && mainView.needsCanvasResize(newWidth, newHeight)) {
                log.debug('[CheckDetails] Resizing canvas for new viewport');
                mainView.resizeCanvas(newWidth, newHeight);
            }

            // Update images without recreating canvas
            await mainView.updateImages({
                expectedImage,
                actualImage,
                diffImage,
                actual,
            });

            // @ts-ignore - update window.mainView for E2E tests
            window.mainView = mainView;
        };

        updateCheckImages();

        return () => {
            isMounted = false;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCheck?._id]); // Only when check ID changes

    // Sync window.mainView with React state for E2E tests
    useEffect(function syncWindowMainView() {
        if (mainView) {
            // @ts-ignore - window.mainView is used by E2E tests
            window.mainView = mainView;
        }
    }, [mainView]);

    useEffect(function afterMainViewCreatedHandleRegions() {
        if (!baselineId) return;
        if (mainView) {
            mainView.getSnapshotIgnoreRegionsDataAndDrawRegions(baselineId);
        }
    }, [
        mainView,
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
                    navigationReady={!siblingChecksQuery.isLoading && siblingChecks.length > 0 && currentCheckIndex >= 0}
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
                        isLoading={!mainView}
                    />
                </Group>
            </Stack>
        </Group>
    );
}
