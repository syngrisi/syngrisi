/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { ActionIcon, Group, Kbd, Stack, Text, Tooltip, Divider } from '@mantine/core';
import { IconDeviceFloppy, IconShape, IconShapeOff, IconBoxMargin } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { MainView } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/mainView';
import { log } from '@shared/utils/Logger';
import { MatchTypeSelector } from './MatchTypeSelector';

interface Props {
    mainView: any
    baselineId: string
    view: string,
}

export function RegionsToolbar({ mainView, baselineId, view }: Props) {
    const [visibleRegionRemoveButton, setVisibleRegionRemoveButton] = useState(false);

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
    useHotkeys([
        ['alt+S', () => {
            MainView.sendRegions(baselineId!, mainView.getRegionsData());
        }],
        ['Delete', () => mainView.removeActiveIgnoreRegions()],
        ['Backspace', () => mainView.removeActiveIgnoreRegions()],
        ['A', () => {
            if (baselineId && view !== 'slider') {
                mainView.addIgnoreRegion({ name: 'ignore_rect', strokeWidth: 0 });
            }
        }],
        ['B', () => {
            if (baselineId && view !== 'slider') {
                mainView.addBoundingRegion('bound_rect');
            }
        }],
    ]);

    useEffect(function initView() {
        if (mainView) {
            regionsSelectionEvents();
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
                        disabled={(view === 'slider') || !baselineId}
                        onClick={() => mainView.addIgnoreRegion({ name: 'ignore_rect', strokeWidth: 0 })}
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
                        </Stack>
                    )
                }
            >
                <div>
                    <ActionIcon
                        data-check="add-bound-region"
                        disabled={(view === 'slider') || !baselineId}
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
                            <Text>Save ignore Regions</Text>
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
                    onClick={() => MainView.sendRegions(baselineId!, mainView.getRegionsData())}
                >
                    <IconDeviceFloppy size={24} stroke={1} />
                </ActionIcon>
            </Tooltip>

            <Divider orientation="vertical" />

            <MatchTypeSelector baselineId={baselineId} />
        </>
    );
}
