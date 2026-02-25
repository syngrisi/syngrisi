/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line,prefer-arrow-callback,max-len,react/jsx-indent */
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { createStyles, Group, Loader, Stack, Box } from '@mantine/core';
import { useDisclosure, useDocumentTitle, useHotkeys } from '@mantine/hooks';
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
import { RCAPanel, useRCA } from '@index/components/Tests/Table/Checks/CheckDetails/RCA';

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
    apikey?: string,
}

export function CheckDetails({
    initCheckData,
    checkQuery,
    closeHandler,
    relatedRendered = true,
    testList = [],
    apikey,
}: Props) {
    useDocumentTitle(initCheckData?.name);
    const canvasElementRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const { query, setQuery } = useParams();
    const { classes } = useStyles();
    const [mainView, setMainView] = useState<MainView | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    
    // RCA Panel Resizing State
    const [rcaPanelWidth, setRcaPanelWidth] = useState(500);
    const [isResizing, setIsResizing] = useState(false);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    const [relatedActiveCheckId, setRelatedActiveCheckId] = useState<string>(initCheckData._id);
    const [relatedChecksOpened, relatedChecksHandler] = useDisclosure(relatedRendered);

    const currentCheck = initCheckData;
    const textLoader = <Loader size="xs" color="blue" variant="dots" />;

    // Fetch baseline document to get the correct baselineId (needed for RCA)
    // Note: currentCheck.baselineId._id is the Snapshot ID, not Baseline document ID!
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

    // Extract the actual Baseline document ID from the query result
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

    // RCA (Root Cause Analysis) hook - uses correct Baseline document ID
    const rca = useRCA({
        checkId: initCheckData?._id || null,
        baselineId: baselineId || null,  // Use computed baselineId, not Snapshot ID!
        shareToken: query.share || undefined,
    });

    // Hotkey for RCA toggle (D key)
    useHotkeys([['d', () => rca.toggle()]]);

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

    const settingsQuery = useQuery(
        ['settings-public'],
        () => GenericService.get('settings/public'),
        { refetchOnWindowFocus: false }
    );

    const isShareEnabled = useMemo(() => {
        if (!settingsQuery.data) return true;
        const setting = settingsQuery.data.find((s: any) => s.name === 'share_enabled');
        if (!setting) return true;
        // Check both: setting must be enabled AND its value must be "true"
        const valueIsTrue = setting.value === 'true' || setting.value === true;
        const isEnabled = setting.enabled !== false;
        return valueIsTrue && isEnabled;
    }, [settingsQuery.data]);

    const isRCAEnabled = useMemo(() => {
        if (!settingsQuery.data) return false;
        const setting = settingsQuery.data.find((s: any) => s.name === 'rca_enabled');
        if (!setting) return false;
        return setting.value === true || setting.value === 'true';
    }, [settingsQuery.data]);

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
                share: apikey,
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

        if (mainView?.isDirty() && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
            return;
        }

        const targetIndex = direction === 'prev' ? currentCheckIndex - 1 : currentCheckIndex + 1;
        if (targetIndex >= 0 && targetIndex < siblingChecks.length) {
            setQuery({ checkId: siblingChecks[targetIndex]._id });
        }
    };

    const handleNavigateTest = async (direction: 'prev' | 'next') => {
        if (!testList || !testList.length) return;

        if (mainView?.isDirty() && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
            return;
        }

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
                    share: apikey,
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
        let expectedImgSrcBase = `${config.baseUri}/snapshoots/${currentCheck?.baselineId?.filename}`;
        let actualImgSrcBase = `${config.baseUri}/snapshoots/${currentCheck?.actualSnapshotId?.filename}`;
        let diffImgSrcBase = currentCheck?.diffId?.filename
            ? `${config.baseUri}/snapshoots/${currentCheck?.diffId?.filename}`
            : null;

        if (apikey) {
            expectedImgSrcBase += `?share=${apikey}`;
            actualImgSrcBase += `?share=${apikey}`;
            if (diffImgSrcBase) diffImgSrcBase += `?share=${apikey}`;
        }

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
            if (canvasContainerRef.current) {
                canvasContainerRef.current.style.height = `${MainView.calculateExpectedCanvasViewportAreaSize().height - 10}px`;
            }

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

    // Sync RCA overlay with MainView
    useEffect(function syncRCAWithMainView() {
        if (!mainView) return;

        // Set callbacks for RCA overlay events
        mainView.setRCACallbacks({
            onElementHover: (node) => {
                rca.setHoveredElement(node);
            },
            onElementClick: (node, change) => {
                if (change) {
                    rca.selectChange(change);
                }
                rca.selectElement(node);
            },
        });

        // Enable/disable overlay based on RCA state
        if (rca.state.isEnabled && rca.state.actualDom && rca.state.diffResult) {
            mainView.enableRCAOverlay(
                rca.state.actualDom,
                rca.state.baselineDom,
                rca.state.diffResult.changes,
                rca.state.isWireframeEnabled
            );
        } else {
            mainView.disableRCAOverlay();
        }
    }, [
        mainView,
        rca.state.isEnabled,
        rca.state.actualDom,
        rca.state.baselineDom,
        rca.state.diffResult,
        rca.state.isWireframeEnabled,
    ]);

    // Sync wireframe state
    useEffect(function syncRCAWireframe() {
        if (!mainView || !rca.state.isEnabled) return;
        mainView.toggleRCAWireframe(rca.state.isWireframeEnabled);
    }, [mainView, rca.state.isEnabled, rca.state.isWireframeEnabled]);

    // Highlight selected change on canvas
    useEffect(function highlightSelectedRCAChange() {
        if (!mainView || !rca.state.isEnabled) return;
        mainView.highlightRCAChange(rca.state.selectedChange);
    }, [mainView, rca.state.isEnabled, rca.state.selectedChange]);

    // Handle dirty state updates from canvas events
    useEffect(() => {
        if (!mainView?.canvas) return;

        const updateDirtyState = () => {
            setIsDirty(mainView.isDirty());
        };

        const events = {
            'object:added': updateDirtyState,
            'object:removed': updateDirtyState,
            'object:modified': updateDirtyState,
            'selection:updated': updateDirtyState, // Maybe not needed for dirty state but good for consistency
        };

        mainView.canvas.on(events);

        return () => {
            mainView.canvas.off(events);
        };
    }, [mainView]);

    // Handle resize when RCA panel toggles or resizes
    useEffect(() => {
        if (!mainView || !canvasElementRef.current) return;

        // Small timeout to allow layout to update
        const timer = setTimeout(() => {
            const newWidth = canvasElementRef.current.clientWidth;
            const newHeight = canvasElementRef.current.clientHeight;
            if (mainView.needsCanvasResize(newWidth, newHeight)) {
                mainView.resizeCanvas(newWidth, newHeight);
            }
        }, 50);

        return () => clearTimeout(timer);
    }, [mainView, rca.state.isPanelOpen, rcaPanelWidth]);

    // Handle mouse events for resizing RCA Panel
    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            // Calculate new width relative to right edge:
            // Mouse moving to left (smaller clientX) -> wider panel
            const deltaX = startXRef.current - e.clientX;
            const newWidth = Math.max(300, startWidthRef.current + deltaX);
            // Cap width to not cover the entire screen (e.g., leave 300px for canvas)
            const maxWidth = window.innerWidth - 300;
            setRcaPanelWidth(Math.min(newWidth, maxWidth));
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            // Enable text selection and pointer events on canvas again
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    // Native window alert for closing tab/window
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

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
                    rcaEnabled={rca.state.isEnabled}
                    isRCAFeatureEnabled={isRCAEnabled}
                    onToggleRCA={rca.toggle}
                    rcaStats={rca.state.diffResult?.stats}
                    isWireframeEnabled={rca.state.isWireframeEnabled}
                    onToggleWireframe={rca.toggleWireframe}
                    isShareEnabled={isShareEnabled}
                    apikey={apikey}
                />

                <Group
                    spacing={4}
                    align="stretch"
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

                    {/* Canvas container with split view for RCA panel */}
                    <Box
                        ref={canvasContainerRef}
                        style={{
                            flex: 1, display: 'flex', minWidth: 0, position: 'relative', overflow: 'hidden',
                        }}
                    >
                        <Box style={{
                            flex: 1, position: 'relative', minWidth: 0, overflow: 'hidden',
                        }}
                        >
                            <Canvas
                                canvasElementRef={canvasElementRef}
                                isRelatedOpened={relatedRendered && relatedChecksOpened}
                                isLoading={!mainView}
                            />
                        </Box>

                        {/* RCA Panel - positioned as side panel */}
                        {rca.state.isPanelOpen && (
                            <>
                                {/* Resize Handle */}
                                <Box
                                    data-test="rca-panel-resize-handle"
                                    onMouseDown={(e: React.MouseEvent) => {
                                        e.preventDefault();
                                        setIsResizing(true);
                                        startXRef.current = e.clientX;
                                        startWidthRef.current = rcaPanelWidth;
                                        // Disable text selection and change cursor globally while dragging
                                        document.body.style.userSelect = 'none';
                                        document.body.style.cursor = 'col-resize';
                                    }}
                                    style={{
                                        width: '4px',
                                        cursor: 'col-resize',
                                        backgroundColor: isResizing ? 'var(--mantine-color-blue-6)' : 'transparent',
                                        borderLeft: '1px solid var(--mantine-color-dark-4)',
                                        zIndex: 10,
                                        transition: 'background-color 0.2s',
                                        flexShrink: 0,
                                    }}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'var(--mantine-color-blue-5) !important',
                                        },
                                    }}
                                />
                                <Box
                                    data-test="rca-panel-container"
                                    style={{
                                        width: `${rcaPanelWidth}px`,
                                        flexShrink: 0,
                                        backgroundColor: 'var(--mantine-color-dark-7)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <RCAPanel
                                        isLoading={rca.state.isLoading}
                                        error={rca.state.error}
                                        diffResult={rca.state.diffResult}
                                        selectedChange={rca.state.selectedChange}
                                        selectedElement={rca.state.selectedElement}
                                        onSelectChange={rca.selectChange}
                                        onClose={rca.disable}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Group>
            </Stack>
        </Group>
    );
}
