import * as React from 'react';
import { Group, Divider, ActionIcon, Menu } from '@mantine/core';
import { IconDotsVertical, IconTrash, IconChevronLeft, IconChevronRight, IconChevronUp, IconChevronDown, IconShare } from '@tabler/icons-react';
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
import { useState, useEffect } from 'react';

interface Props {
    mainView: any
    classes: any
    curCheck: any
    baselineId: string
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
}

export function Toolbar(
    {
        mainView,
        classes,
        curCheck,
        baselineId,
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
    }: Props,
) {
    const { query } = useParams();
    const [view, setView] = useState('actual');
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [shareModalOpened, setShareModalOpened] = useState(false);
    const queryClient = useQueryClient();
    const isShareMode = !!query.share;

    const mutationRemoveBaseline = useMutation(
        (id: string) => GenericService.delete('baselines', id),
        {
            onSuccess: async () => {
                successMsg({ message: 'Baseline has been successfully removed' });
                setDeleteModalOpened(false);
                await queryClient.invalidateQueries({ queryKey: ['baseline_by_snapshot_id'] });
                await queryClient.invalidateQueries({ queryKey: ['check_for_modal'] });
                if (checkQuery) checkQuery.refetch();
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
        if (mainView?.diffImage) {
            setView(() => 'diff');
            return;
        }
        setView(() => 'actual');
    }, [mainView?.diffImage, query.checkId]);

    useEffect(function switchView() {
        if (!mainView) return;
        mainView.switchView(view);
    }, [view, mainView]);

    return (
        <>
            <Group position="apart" noWrap data-check="toolbar" data-navigation-ready={navigationReady ? 'true' : 'false'}>
                {/* Left side: Navigation arrows (fixed position) + ScreenshotDetails */}
                <Group spacing="sm" noWrap>
                    <Group spacing={2} noWrap>
                        <ActionIcon
                            onClick={() => onNavigateCheck && onNavigateCheck('prev')}
                            disabled={isFirstCheck}
                            title="Previous Check"
                            variant="transparent"
                        >
                            <IconChevronLeft size={20} />
                        </ActionIcon>
                        <ActionIcon
                            onClick={() => onNavigateCheck && onNavigateCheck('next')}
                            disabled={isLastCheck}
                            title="Next Check"
                            variant="transparent"
                        >
                            <IconChevronRight size={20} />
                        </ActionIcon>
                    </Group>
                    <Group spacing={2} noWrap>
                        <ActionIcon
                            onClick={() => onNavigateTest && onNavigateTest('prev')}
                            disabled={isFirstTest}
                            title="Previous Test"
                            variant="transparent"
                        >
                            <IconChevronUp size={20} />
                        </ActionIcon>
                        <ActionIcon
                            onClick={() => onNavigateTest && onNavigateTest('next')}
                            disabled={isLastTest}
                            title="Next Test"
                            variant="transparent"
                        >
                            <IconChevronDown size={20} />
                        </ActionIcon>
                    </Group>

                    <Divider orientation="vertical" />

                    <ScreenshotDetails mainView={mainView} check={curCheck} />
                </Group>

                {/* Right side: Tools and actions */}
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

                    <ViewSegmentedControl view={view} setView={setView} currentCheck={curCheck} />

                    <Divider orientation="vertical" />

                    <HighlightButton
                        mainView={mainView as MainView}
                        disabled={!(view === 'diff' && parseFloat(curCheck?.parsedResult?.rawMisMatchPercentage) < 5)}
                    />

                    <Divider orientation="vertical" />

                    <RegionsToolbar mainView={mainView} baselineId={baselineId} view={view} hasDiff={!!mainView?.diffImage} />

                    <Divider orientation="vertical" />

                    {!isShareMode && (
                        <>
                            <AcceptButton
                                check={curCheck}
                                initCheck={initCheckData}
                                checksQuery={checkQuery}
                                size={24}
                                testUpdateQuery={checkQuery}
                            />

                            <RemoveButton
                                check={curCheck}
                                initCheck={initCheckData}
                                testUpdateQuery={checkQuery}
                                size={30}
                                closeHandler={closeHandler}
                            />
                        </>
                    )}

                    {!isShareMode && (
                        <Menu shadow="md" width={200} withinPortal>
                            <Menu.Target>
                                <ActionIcon data-test="check-details-menu">
                                    <IconDotsVertical size={20} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item
                                    icon={<IconShare size={14} />}
                                    onClick={() => setShareModalOpened(true)}
                                    data-test="menu-share-check"
                                >
                                    Share
                                </Menu.Item>
                                <Menu.Item
                                    color="red"
                                    icon={<IconTrash size={14} />}
                                    disabled={!baselineId}
                                    onClick={() => setDeleteModalOpened(true)}
                                    data-test="menu-delete-baseline"
                                >
                                    Delete Baseline
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    )}
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
