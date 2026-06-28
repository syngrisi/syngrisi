import * as React from 'react';
import { Divider, Group, Menu, ActionIcon, Tooltip as MantineTooltip } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconDotsVertical, IconTrash, IconChevronLeft, IconChevronRight, IconChevronUp, IconChevronDown, IconShare, IconAnalyze, IconSparkles, IconBinoculars } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GenericService } from '@shared/services';
import { errorMsg, successMsg } from '@shared/utils/utils';
import { AcceptButton } from '@index/components/Tests/Table/Checks/AcceptButton';
import { RemoveButton } from '@index/components/Tests/Table/Checks/RemoveButton';
import { useParams } from '@hooks/useParams';
import { ScreenshotDetails } from '@index/components/Tests/Table/Checks/CheckDetails/Toolbar/ScreenshotDetails';
import { ZoomToolbar } from '@index/components/Tests/Table/Checks/CheckDetails/Toolbar/ZoomToolbar';
import { ViewSegmentedControl } from '@index/components/Tests/Table/Checks/CheckDetails/Toolbar/ViewSegmentedControl';
import { HighlightButton } from '@index/components/Tests/Table/Checks/CheckDetails/Toolbar/HighlightButton';
import { RegionsToolbar } from '@index/components/Tests/Table/Checks/CheckDetails/Toolbar/RegionsToolbar';
import { MainView } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/mainView';
import { DeleteBaselineModal } from '../Modals/DeleteBaselineModal';
import { ShareModal } from '../Modals/ShareModal';


interface Props {
    mainView: any
    classes: any
    curCheck: any
    baselineId: string
    baselineData?: any
    initCheckData: any
    checkQuery: any
    closeHandler: any
    usageCount?: number
    onNavigateCheck?: (direction: 'prev' | 'next') => void
    onNavigateTest?: (direction: 'prev' | 'next') => void
    isFirstCheck?: boolean
    isLastCheck?: boolean
    isFirstTest?: boolean
    isLastTest?: boolean
    navigationReady?: boolean
    rcaEnabled?: boolean
    onToggleRCA?: () => void
    isShareEnabled?: boolean
    isRCAFeatureEnabled?: boolean
    apikey?: string
    onRunTriage?: () => void
    triageRunning?: boolean
}

export function Toolbar(
    {
        mainView,
        classes,
        curCheck,
        baselineId,
        baselineData,
        initCheckData,
        checkQuery,
        closeHandler,
        usageCount,
        onNavigateCheck,
        onNavigateTest,
        isFirstCheck,
        isLastCheck,
        isFirstTest,
        isLastTest,
        navigationReady,
        rcaEnabled,
        onToggleRCA,
        isShareEnabled = true,
        isRCAFeatureEnabled = false,
        apikey,
        onRunTriage,
        triageRunning = false,
    }: Props,
) {
    const { query, setQuery } = useParams();
    const [view, setView] = useState(() => (curCheck?.diffId?.filename ? 'diff' : 'actual'));
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [shareModalOpened, setShareModalOpened] = useState(false);
    const queryClient = useQueryClient();
    const isShareMode = !!query.share;
    const toolbarActionIconSize = 32;
    const toolbarGlyphSize = 20;

    const mutationRemoveBaseline = useMutation(
        {
            mutationFn: (id: string) => GenericService.delete('baselines', id),
            onSuccess: async () => {
                successMsg({ message: 'Baseline has been successfully removed' });
                setDeleteModalOpened(false);
                if (curCheck?.baselineId?._id) {
                    await queryClient.invalidateQueries({ queryKey: ['baseline_by_snapshot_id', curCheck.baselineId._id] });
                }
                await queryClient.invalidateQueries({ queryKey: ['check_for_modal', curCheck._id], exact: true });
                if (closeHandler) closeHandler();
            },
            onError: (e: any) => {
                errorMsg({ error: 'Cannot remove the baseline' });
                console.error(e);
            },
        },
    );

    const handleDeleteBaseline = () => {
        if (baselineId) {
            mutationRemoveBaseline.mutate(baselineId);
        }
    };

    useEffect(function initView() {
        if (mainView?.diffImage || curCheck?.diffId?.filename) {
            setView(() => 'diff');
            return;
        }
        setView(() => 'actual');
    }, [mainView?.diffImage, curCheck?.diffId?.filename, query.checkId]);

    useEffect(function switchView() {
        if (!mainView) return;
        mainView.switchView(view);
    }, [view, mainView]);

    return (
        <>
            <Group justify="space-between" wrap="nowrap" data-check="toolbar" data-navigation-ready={navigationReady ? 'true' : 'false'}>
                {/* Left side: Navigation arrows (fixed position) + ScreenshotDetails */}
                <Group gap="sm" wrap="nowrap">
                    {!isShareMode && (
                        <>
                            <Group gap={2} wrap="nowrap">
                                <ActionIcon
                                    onClick={() => onNavigateCheck && onNavigateCheck('prev')}
                                    disabled={isFirstCheck}
                                    title="Previous Check"
                                    variant="transparent"
                                    color="gray"
                                    size={toolbarActionIconSize}
                                    styles={{
                                        root: {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                >
                                    <IconChevronLeft size={toolbarGlyphSize} />
                                </ActionIcon>
                                <ActionIcon
                                    onClick={() => onNavigateCheck && onNavigateCheck('next')}
                                    disabled={isLastCheck}
                                    title="Next Check"
                                    variant="transparent"
                                    color="gray"
                                    size={toolbarActionIconSize}
                                    styles={{
                                        root: {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                >
                                    <IconChevronRight size={toolbarGlyphSize} />
                                </ActionIcon>
                            </Group>
                            <Group gap={2} wrap="nowrap">
                                <ActionIcon
                                    onClick={() => onNavigateTest && onNavigateTest('prev')}
                                    disabled={isFirstTest}
                                    title="Previous Test"
                                    variant="transparent"
                                    color="gray"
                                    size={toolbarActionIconSize}
                                    styles={{
                                        root: {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                >
                                    <IconChevronUp size={toolbarGlyphSize} />
                                </ActionIcon>
                                <ActionIcon
                                    onClick={() => onNavigateTest && onNavigateTest('next')}
                                    disabled={isLastTest}
                                    title="Next Test"
                                    variant="transparent"
                                    color="gray"
                                    size={toolbarActionIconSize}
                                    styles={{
                                        root: {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                >
                                    <IconChevronDown size={toolbarGlyphSize} />
                                </ActionIcon>
                            </Group>

                            <Divider orientation="vertical" />
                        </>
                    )}

                    <ScreenshotDetails mainView={mainView} check={curCheck} view={view} apikey={apikey} rcaEnabled={rcaEnabled} />
                </Group>

                {/* Right side: Tools and actions */}
                <Group gap="sm" wrap="nowrap">
                    <Group
                        gap={4}
                        style={classes.zoomButtonsWrapper}
                        justify="center"
                        align="center"
                        wrap="nowrap"
                    >
                        <ZoomToolbar mainView={mainView as MainView} view={view} />
                    </Group>

                    <Divider orientation="vertical" />

                    <ViewSegmentedControl view={view} setView={setView} currentCheck={curCheck} />

                    <Divider orientation="vertical" />

                    <HighlightButton
                        mainView={mainView as MainView}
                        disabled={!(view === 'diff' && parseFloat(curCheck?.parsedResult?.rawMisMatchPercentage) < 5)}
                    />

                    <Divider orientation="vertical" />

                    {
                        !isShareMode && (
                            <>
                                <RegionsToolbar
                                    mainView={mainView}
                                    baselineId={baselineId}
                                    baselineData={baselineData}
                                    view={view}
                                    hasDiff={!!mainView?.diffImage}
                                    currentCheck={curCheck}
                                    checkQuery={checkQuery}
                                    initialCheckId={initCheckData?._id}
                                    apikey={apikey}
                                />
                                <Divider orientation="vertical" />
                            </>
                        )
                    }

                    {
                        !isShareMode && (
                            <>
                                <AcceptButton
                                    check={curCheck}
                                    initCheck={initCheckData}
                                    checksQuery={checkQuery}
                                    size={22}
                                    buttonSize={toolbarActionIconSize}
                                    testUpdateQuery={checkQuery}
                                />

                                <RemoveButton
                                    check={curCheck}
                                    initCheck={initCheckData}
                                    testUpdateQuery={checkQuery}
                                    size={22}
                                    buttonSize={toolbarActionIconSize}
                                    closeHandler={closeHandler}
                                />
                            </>
                        )
                    }

                    {(() => {
                        const st = String(Array.isArray(curCheck?.status) ? curCheck.status[0] : (curCheck?.status ?? '')).toLowerCase();
                        const canFindSimilar = st === 'failed' && !!curCheck?.diffId;
                        const showRCA = !!(onToggleRCA && isRCAFeatureEnabled);
                        if (!showRCA && !canFindSimilar && !onRunTriage) return null;
                        // RCA + AI Match + Triage share one group with no dividers between them.
                        return (
                            <>
                                <Divider orientation="vertical" />
                                <Group gap={4} wrap="nowrap" data-test="triage-toolbar">
                                    {showRCA && (
                                        <ActionIcon
                                            onClick={onToggleRCA}
                                            title="Root Cause Analysis (D)"
                                            variant={rcaEnabled ? 'light' : 'subtle'}
                                            color="gray"
                                            data-test="rca-toggle-button"
                                            size={toolbarActionIconSize}
                                        >
                                            <IconAnalyze size={toolbarGlyphSize} />
                                        </ActionIcon>
                                    )}
                                    {canFindSimilar && (
                                        <MantineTooltip label="AI Match — find the same change across checks" withinPortal>
                                            <ActionIcon
                                                component="a"
                                                href={`?similarTo=${curCheck._id}`}
                                                onClick={(e) => { e.preventDefault(); setQuery({ similarTo: String(curCheck._id), checkId: undefined, modalIsOpen: undefined }); }}
                                                title="AI Match"
                                                aria-label="AI Match"
                                                variant="subtle"
                                                color="gray"
                                                size={toolbarActionIconSize}
                                                data-test="find-similar-checks"
                                                data-check-find-similar={curCheck.name}
                                            >
                                                <IconBinoculars size={toolbarGlyphSize} />
                                            </ActionIcon>
                                        </MantineTooltip>
                                    )}
                                    {onRunTriage && (
                                        <ActionIcon
                                            onClick={onRunTriage}
                                            title="Run AI Triage"
                                            aria-label="Run AI Triage"
                                            variant="subtle"
                                            color="gray"
                                            loading={triageRunning}
                                            data-test="triage-run-button"
                                            size={toolbarActionIconSize}
                                        >
                                            <IconSparkles size={toolbarGlyphSize} />
                                        </ActionIcon>
                                    )}
                                </Group>
                            </>
                        );
                    })()}

                    {/* Kebab menu sits at the far right of the toolbar. */}
                    {
                        !isShareMode && (
                            <>
                                <Divider orientation="vertical" />
                                <Menu shadow="md" width={200} withinPortal>
                                    <Menu.Target>
                                        <ActionIcon data-test="check-details-menu" variant="transparent" color="gray" size={toolbarActionIconSize}>
                                            <IconDotsVertical size={toolbarGlyphSize} />
                                        </ActionIcon>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Item
                                            leftSection={<IconShare size={14} />}
                                            onClick={isShareEnabled ? () => setShareModalOpened(true) : undefined}
                                            data-test="menu-share-check"
                                            data-share-enabled={isShareEnabled.toString()}
                                            disabled={!isShareEnabled}
                                            title={!isShareEnabled ? 'Sharing is globally disabled by administrator' : 'Share'}
                                        >
                                            Share
                                        </Menu.Item>
                                        <Menu.Item
                                            color="red"
                                            leftSection={<IconTrash size={14} />}
                                            disabled={!baselineId}
                                            onClick={() => setDeleteModalOpened(true)}
                                            data-test="menu-delete-baseline"
                                        >
                                            Delete Baseline
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </>
                        )
                    }
                </Group>
            </Group>
            <DeleteBaselineModal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                onConfirm={handleDeleteBaseline}
                usageCount={usageCount || 0}
                snapshotId={curCheck?.baselineId?._id}
            />
            <ShareModal
                opened={shareModalOpened}
                onClose={() => setShareModalOpened(false)}
                checkId={curCheck?._id}
            />
        </>
    );
}
