/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { ActionIcon, Group, Kbd, Stack, Text, Tooltip, Divider } from '@mantine/core';
import { IconDeviceFloppy, IconShape, IconShapeOff, IconBoxMargin, IconWand } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { MainView } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/mainView';
import { log } from '@shared/utils/Logger';
import { successMsg } from '@shared/utils/utils';
import { MatchTypeSelector } from './MatchTypeSelector';

interface Props {
    mainView: any
    baselineId: string
    [key: string]: any
}

export function RegionsToolbar({ mainView, baselineId, view, hasDiff }: Props) {
    const [visibleRegionRemoveButton, setVisibleRegionRemoveButton] = useState(false);
    const [hasBoundRegion, setHasBoundRegion] = useState(false);
    const [hasAnyRegion, setHasAnyRegion] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const handleAutoRegion = async () => {
        if (!baselineId || !hasDiff || view === 'slider' || !mainView) {
            log.debug('Auto region not available: missing baseline, diff, or wrong view');
            return;
        }
        const count = await mainView.createAutoIgnoreRegions();
        if (count > 0) {
            successMsg({ msg: `Created ${count} ignore region${count > 1 ? 's' : ''} from diff` });
        }
    };

    const checkBoundRegionPresence = () => {
        if (!mainView?.canvas) return;
        const hasBound = mainView.canvas.getObjects()
            .some((obj: any) => obj.name === 'bound_rect');
        setHasBoundRegion(hasBound);
    };

    const checkAnyRegionPresence = () => {
        if (!mainView) return;
        setHasAnyRegion(mainView.hasRegions());
        setIsDirty(mainView.isDirty());
    };

    const regionsSelectionEvents = () => {
        const handler = () => {
            const els = mainView.canvas.getActiveObjects()
                .filter((x: any) => x.name === 'ignore_rect');

            if (els.length > 0) {
                setVisibleRegionRemoveButton(() => true);
            } else {
                setVisibleRegionRemoveButton(() => false);
            }
        };

        mainView.canvas.on(
            {
                'selection:cleared':
                    // eslint-disable-next-line no-unused-vars
                    (e: any) => {
                        log.debug('cleared selection');
                        handler();
                    },
                'selection:updated':
                    // eslint-disable-next-line no-unused-vars
                    (e: any) => {
                        log.debug('update selection');
                        handler();
                    },
                'selection:created':
                    // eslint-disable-next-line no-unused-vars
                    (e: any) => {
                        log.debug('create selection');
                        handler();
                    },
            },
        );
    };

    const boundRegionEvents = () => {
        if (!mainView?.canvas) return;
        checkBoundRegionPresence();
        checkAnyRegionPresence();

        mainView.canvas.on({
            'object:added': (e: any) => {
                if (e.target?.name === 'bound_rect') checkBoundRegionPresence();
                checkAnyRegionPresence();
            },
            'object:removed': (e: any) => {
                if (e.target?.name === 'bound_rect') checkBoundRegionPresence();
                checkAnyRegionPresence();
            },
            'object:modified': () => {
                checkAnyRegionPresence();
            },
        });
    };

    useHotkeys([
        ['alt+S', () => {
            mainView.saveRegions(baselineId!);
        }],
        ['Delete', () => mainView.removeActiveIgnoreRegions()],
        ['Backspace', () => mainView.removeActiveIgnoreRegions()],
        ['A', () => {
            if (baselineId && view !== 'slider') {
                mainView.addIgnoreRegion({ name: 'ignore_rect', strokeWidth: 0 });
            }
        }],
        ['B', () => {
            if (baselineId && view !== 'slider' && !hasBoundRegion) {
                mainView.addBoundingRegion('bound_rect');
            }
        }],
        ['R', () => {
            handleAutoRegion();
        }],
    ]);

    useEffect(function initView() {
        if (mainView) {
            regionsSelectionEvents();
            boundRegionEvents();
        }
    }, [
        mainView?.toString(),
    ]);
    return (
        <>
            <Tooltip
                label={
                    (
                        <Group noWrap>
                            <Text>Remove selected ignore regions</Text>
                            <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>Del</Kbd>
                            {' or '}
                            <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>Backspace</Kbd>
                        </Group>
                    )
                }
            >
                <ActionIcon
                    data-check="remove-ignore-region"
                    data-disabled={!visibleRegionRemoveButton ? "true" : undefined}
                    disabled={!visibleRegionRemoveButton}
                    onClick={() => mainView.removeActiveIgnoreRegions()}
                >
                    <IconShapeOff size={24} stroke={1} />
                </ActionIcon>
            </Tooltip>

            <Tooltip
                multiline
                withinPortal
                label={
                    (
                        <Stack spacing={4}>
                            <Group noWrap spacing={4}>
                                <Text>Add ignore region</Text>
                                <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>A</Kbd>
                            </Group>
                            {
                                !baselineId && (
                                    <Group noWrap spacing={4}>
                                        <Text color="orange">&#9888;</Text>
                                        <Text> First you need to accept this check</Text>
                                    </Group>
                                )
                            }
                        </Stack>
                    )
                }
            >
                <div>
                    <ActionIcon
                        data-check="add-ignore-region"
                        data-disabled={((view === 'slider') || !baselineId) ? "true" : undefined}
                        disabled={(view === 'slider') || !baselineId}
                        onClick={() => {
                            // @ts-ignore - Sync window.mainView for E2E tests before calling method
                            if (mainView) window.mainView = mainView;
                            mainView.addIgnoreRegion({ name: 'ignore_rect', strokeWidth: 0 });
                        }}
                    >
                        <IconShape size={24} stroke={1} />
                    </ActionIcon>
                </div>
            </Tooltip>

            <Tooltip
                multiline
                withinPortal
                label={
                    (
                        <Stack spacing={4}>
                            <Group noWrap spacing={4}>
                                <Text>Auto ignore regions from diff</Text>
                                <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>R</Kbd>
                            </Group>
                            <Text size="xs" color="dimmed">Create ignore regions for all diff areas</Text>
                            {
                                !baselineId && (
                                    <Group noWrap spacing={4}>
                                        <Text color="orange">&#9888;</Text>
                                        <Text> First you need to accept this check</Text>
                                    </Group>
                                )
                            }
                            {
                                baselineId && !hasDiff && (
                                    <Group noWrap spacing={4}>
                                        <Text color="dimmed">&#8505;</Text>
                                        <Text color="dimmed"> No diff available</Text>
                                    </Group>
                                )
                            }
                        </Stack>
                    )
                }
            >
                <div>
                    <ActionIcon
                        data-check="auto-ignore-region"
                        data-disabled={((view === 'slider') || !baselineId || !hasDiff) ? "true" : undefined}
                        disabled={(view === 'slider') || !baselineId || !hasDiff}
                        onClick={handleAutoRegion}
                    >
                        <IconWand size={24} stroke={1} />
                    </ActionIcon>
                </div>
            </Tooltip>

            <Tooltip
                multiline
                withinPortal
                label={
                    (
                        <Stack spacing={4}>
                            <Group noWrap spacing={4}>
                                <Text>Checked area only</Text>
                                <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>B</Kbd>
                            </Group>
                            <Text size="xs" color="dimmed">Compare only within this region</Text>
                            {
                                !baselineId && (
                                    <Group noWrap spacing={4}>
                                        <Text color="orange">&#9888;</Text>
                                        <Text> First you need to accept this check</Text>
                                    </Group>
                                )
                            }
                            {
                                baselineId && hasBoundRegion && (
                                    <Group noWrap spacing={4}>
                                        <Text color="orange">&#9888;</Text>
                                        <Text> Bound region already exists</Text>
                                    </Group>
                                )
                            }
                        </Stack>
                    )
                }
            >
                <div>
                    <ActionIcon
                        data-check="add-bound-region"
                        data-disabled={((view === 'slider') || !baselineId || hasBoundRegion) ? "true" : undefined}
                        disabled={(view === 'slider') || !baselineId || hasBoundRegion}
                        onClick={() => mainView.addBoundingRegion('bound_rect')}
                    >
                        <IconBoxMargin size={24} stroke={1} />
                    </ActionIcon>
                </div>
            </Tooltip>

            <Tooltip
                withinPortal
                label={
                    (
                        <Group>
                            <Text>Save regions</Text>
                            <Group align="left" spacing={4} noWrap>

                                <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>Alt</Kbd>
                                +
                                <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>S</Kbd>
                            </Group>
                        </Group>
                    )
                }
            >
                <ActionIcon
                    data-check="save-ignore-region"
                    data-disabled={(!hasAnyRegion && !isDirty) ? "true" : undefined}
                    disabled={!hasAnyRegion && !isDirty}
                    onClick={() => mainView.saveRegions(baselineId!)}
                >
                    <IconDeviceFloppy size={24} stroke={1} />
                </ActionIcon>
            </Tooltip>

            <Divider orientation="vertical" />

            <MatchTypeSelector baselineId={baselineId} />
        </>
    );
}
