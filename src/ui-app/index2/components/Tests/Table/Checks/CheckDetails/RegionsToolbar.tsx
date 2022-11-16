/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { ActionIcon, Group, Kbd, Stack, Text, Tooltip } from '@mantine/core';
import { IconDeviceFloppy, IconShape, IconShapeOff } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { MainView } from './mainView';

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
                        console.log('cleared selection');
                        handler();
                    },
                'selection:updated':
                // eslint-disable-next-line no-unused-vars
                    (e: any) => {
                        console.log('update selection');
                        handler();
                    },
                'selection:created':
                // eslint-disable-next-line no-unused-vars
                    (e: any) => {
                        console.log('create selection');
                        handler();
                    },
            },
        );
    };
    useHotkeys([
        ['alt+S', () => {
            MainView.sendIgnoreRegions(baselineId!, mainView.getRectData());
        }],
        ['Delete', () => mainView.removeActiveIgnoreRegions()],
        ['Backspace', () => mainView.removeActiveIgnoreRegions()],
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
                        disabled={(view === 'slider') || !baselineId}
                        onClick={() => mainView.addIgnoreRegion({ name: 'ignore_rect', strokeWidth: 0 })}
                    >
                        <IconShape size={24} stroke={1} />
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
                    onClick={() => MainView.sendIgnoreRegions(baselineId!, mainView.getRectData())}
                >
                    <IconDeviceFloppy size={24} stroke={1} />
                </ActionIcon>
            </Tooltip>
        </>
    );
}
