/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line,prefer-arrow-callback,max-len,react/jsx-indent */
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { createStyles, Group, Loader, Stack } from '@mantine/core';
import { useDisclosure, useDocumentTitle } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { MainView } from './Canvas/mainView';
import { createImageAndWaitForLoad, imageFromUrl } from './Canvas/helpers';
import { errorMsg } from '../../../../../../shared/utils';
import { GenericService } from '../../../../../../shared/services';
import config from '../../../../../../config';
import { RelatedChecksContainer } from './RelatedChecks/RelatedChecksContainer';
import { useParams } from '../../../../../hooks/useParams';
import { Toolbar } from './Toolbar/Toolbar';
import { Header } from './Header';
import { Canvas } from './Canvas/Canvas';

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
}

export function CheckDetails({
    initCheckData,
    checkQuery,
    closeHandler,
    relatedRendered = true,
}: Props) {
    useDocumentTitle(initCheckData?.name);
    const canvasElementRef = useRef(null);
    const { query } = useParams();
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

            canvasElementRef.current.style.height = `${MainView.calculateExpectedCanvasViewportAreaSize().height - 10}px`;

            const expectedImage = await imageFromUrl(expectedImg.src);
            const actualImage = await imageFromUrl((actualImg).src);

            const diffImgSrc = `${config.baseUri}/snapshoots/${currentCheck?.diffId?.filename}?diffImg`;
            const diffImage = currentCheck?.diffId?.filename ? await imageFromUrl(diffImgSrc) : null;

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
                    closeHandler={closeHandler}
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
