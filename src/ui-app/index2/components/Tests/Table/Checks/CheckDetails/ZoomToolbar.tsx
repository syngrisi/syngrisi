/* eslint-disable prefer-arrow-callback,react/jsx-one-expression-per-line */
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActionIcon, Button, Group, Kbd, Popover, Stack, Text, Tooltip } from '@mantine/core';
import { IconChevronDown, IconZoomIn, IconZoomOut } from '@tabler/icons';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { MainView } from './mainView';

interface Props {
    view: string
    mainView: MainView
}

export function ZoomToolbar(
    {
        view,
        mainView,
    }: Props,
) {
    const [zoomPercent, setZoomPercent] = useState(100);
    const [openedZoomPopover, zoomPopoverHandler] = useDisclosure(false);

    /**
     * Calculates the biggest expected or actual image dimension
     * for example: expectedImage {width: 100, height: 200}, actualImage: {width: 200, height: 300}
     * the function will return ['actualImage', 'height' ]
     */
    const calculateMaxImagesDimensions = () => {
        const data: any = [
            { imageName: 'expectedImage', dimension: 'width', value: mainView.expectedImage.width },
            { imageName: 'expectedImage', dimension: 'height', value: mainView.expectedImage.height },
            { imageName: 'actualImage', dimension: 'width', value: mainView.actualImage.width },
            { imageName: 'actualImage', dimension: 'height', value: mainView.actualImage.height },
        ];
        const biggestDimensionValue = Math.max(...data.map((x: any) => x.value));
        return data.find((x: any) => x.value === biggestDimensionValue);
    };

    function zoomEvents() {
        mainView.canvas.on('mouse:wheel', (opt: any) => {
            if (!opt.e.ctrlKey) return;
            const delta = opt.e.deltaY;
            let zoomVal = mainView.canvas.getZoom();

            zoomVal *= 0.999 ** delta;
            if (zoomVal > 9) zoomVal = 9;
            if (zoomVal < 0.10) zoomVal = 0.10;
            mainView.canvas.zoomToPoint({
                x: opt.e.offsetX,
                y: opt.e.offsetY,
            }, zoomVal);

            setZoomPercent(() => zoomVal * 100);
            document.dispatchEvent(new Event('zoom'));
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
    }

    const zoomByPercent = (percent: number) => {
        if (!mainView?.canvas) return;
        // mainView.canvas.zoomToPoint(new fabric.Point(mainView.canvas.width / 2,
        //     30), zoomPercent / 100);
        mainView.canvas.setZoom(percent / 100);
        mainView.canvas.renderAll();
        setZoomPercent(() => percent);
    };

    const zoomByDelta = (delta: number) => {
        document.dispatchEvent(new Event('zoom'));
        let newPercent = Math.round(mainView.canvas.getZoom() * 100) + delta;
        newPercent = newPercent < 2 ? 2 : newPercent;
        newPercent = newPercent > 1000 ? 1000 : newPercent;
        zoomByPercent(newPercent);
    };

    const zoomTo = (image: any, dimension: string) => {
        // @ts-ignore
        const ratio = mainView.canvas[dimension] / image[dimension];
        const percent = ratio > 9 ? 900 : ratio * 100;
        zoomByPercent(percent);
        mainView.canvas.renderAll();
    };

    const fitImageIfNeeded = (imageName: string) => {
        const image = mainView[imageName as keyof MainView];
        const greatestDimension = (image.height > image.width) ? 'height' : 'width';

        const anotherDimension = (greatestDimension === 'height') ? 'width' : 'height';

        zoomTo(image, greatestDimension);

        if (
            mainView[imageName as keyof MainView][anotherDimension] * mainView.canvas.getZoom()
            > mainView.canvas[anotherDimension]!
        ) {
            zoomTo(mainView[imageName as keyof MainView], anotherDimension);
        }

        setTimeout(() => {
            mainView.panToCanvasWidthCenter(imageName);
        }, 10);
    };

    const fitImageByWith = (imageName: string) => {
        const image = mainView[imageName as keyof MainView];
        zoomTo(image, 'width');

        setTimeout(() => {
            mainView.panToCanvasWidthCenter(imageName);
        }, 10);
    };

    const fitGreatestImageIfNeeded = () => {
        const greatestImage = calculateMaxImagesDimensions();
        zoomTo(mainView[greatestImage.imageName as keyof MainView], greatestImage.dimension);

        const anotherDimension = (greatestImage.dimension === 'height') ? 'width' : 'height';

        if (
            (mainView[greatestImage.imageName as keyof MainView][anotherDimension] * mainView.canvas.getZoom())
            > mainView.canvas[anotherDimension]!
        ) {
            zoomTo(mainView[greatestImage.imageName as keyof MainView], anotherDimension);
        }

        // initial pan
        setTimeout(() => {
            mainView.panToCanvasWidthCenter(greatestImage.imageName);
        }, 10);
    };

    useEffect(function initZoom() {
        if (mainView) {
            zoomEvents();
            fitGreatestImageIfNeeded();
        }
    }, [
        mainView?.toString(),
    ]);

    useHotkeys([
        // Zoom
        ['Equal', () => zoomByDelta(15)],
        ['NumpadAdd', () => zoomByDelta(15)],
        ['Minus', () => zoomByDelta(-15)],
        ['NumpadSubtract', () => zoomByDelta(-15)],
        ['Digit9', () => fitImageByWith(`${view}Image`)],
        ['Digit0', () => {
            if (view === 'slider') {
                fitImageIfNeeded('actualImage');
                return;
            }
            fitImageIfNeeded(`${view}Image`);
        }],
    ]);

    return (
        <>

            <Tooltip
                label={
                    (
                        <Group noWrap>
                            <Text>Zoom In</Text>
                            <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>+</Kbd>
                        </Group>
                    )
                }
            >
                <ActionIcon
                    onClick={() => zoomByDelta(15)}
                >
                    <IconZoomIn size={24} stroke={1} />
                </ActionIcon>
            </Tooltip>

            <Popover position="bottom" withArrow shadow="md" opened={openedZoomPopover}>
                <Popover.Target>
                    <Group spacing={0} position="center" onClick={zoomPopoverHandler.toggle} noWrap>
                        <Text
                            size="lg"
                            weight={400}
                            sx={{ minWidth: '3em' }}
                        >
                            {Math.round(zoomPercent)}%
                        </Text>
                        <ActionIcon ml={-10}>
                            <IconChevronDown />
                        </ActionIcon>
                    </Group>
                </Popover.Target>
                <Popover.Dropdown p={0}>
                    <Stack spacing={0}>
                        <Button
                            pl={8}
                            pr={8}
                            variant="subtle"
                            onClick={() => {
                                zoomByPercent(50);
                                if (view === 'slider') {
                                    mainView.panToCanvasWidthCenter('actualImage');
                                    return;
                                }
                                mainView.panToCanvasWidthCenter(`${view}Image`);
                                zoomPopoverHandler.close();
                            }}
                        >
                            <Group position="apart" noWrap>50%</Group>
                        </Button>
                        <Button
                            pl={8}
                            pr={8}
                            variant="subtle"
                            onClick={() => {
                                zoomByPercent(100);
                                if (view === 'slider') {
                                    mainView.panToCanvasWidthCenter('actualImage');
                                    return;
                                }
                                mainView.panToCanvasWidthCenter(`${view}Image`);
                                zoomPopoverHandler.close();
                            }}
                        >
                            <Group position="apart" noWrap>100%</Group>
                        </Button>
                        <Button
                            pl={8}
                            pr={8}
                            variant="subtle"
                            onClick={() => {
                                zoomByPercent(200);
                                if (view === 'slider') {
                                    mainView.panToCanvasWidthCenter('actualImage');
                                    return;
                                }
                                mainView.panToCanvasWidthCenter(`${view}Image`);
                                zoomPopoverHandler.close();
                            }}
                        >
                            <Group position="apart" noWrap>200%</Group>
                        </Button>
                        <Button
                            sx={{ width: '100%' }}
                            pl={8}
                            pr={8}
                            variant="subtle"
                            onClick={() => {
                                zoomPopoverHandler.close();
                                if (view === 'slider') {
                                    fitImageByWith('actualImage');
                                    return;
                                }
                                fitImageByWith(`${view}Image`);
                            }}
                        >
                            <Group sx={{ width: '100%' }} position="left" noWrap>
                                Fit by width <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>9</Kbd>
                            </Group>
                        </Button>

                        <Button
                            pl={8}
                            pr={8}
                            variant="subtle"
                            onClick={() => {
                                zoomPopoverHandler.close();

                                if (view === 'slider') {
                                    fitImageIfNeeded('actualImage');
                                    return;
                                }
                                fitImageIfNeeded(`${view}Image`);
                            }}
                        >
                            <Group sx={{ width: '100%' }} position="left" noWrap>
                                Fit to canvas <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>0</Kbd>
                            </Group>
                        </Button>
                    </Stack>
                </Popover.Dropdown>
            </Popover>

            <Tooltip
                label={
                    (
                        <Group noWrap>
                            <Text>Zoom out</Text>
                            <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>-</Kbd>
                        </Group>
                    )
                }
            >
                <ActionIcon
                    onClick={() => zoomByDelta(-15)}
                >
                    <IconZoomOut size={24} stroke={1} />
                </ActionIcon>
            </Tooltip>
        </>
    );
}
