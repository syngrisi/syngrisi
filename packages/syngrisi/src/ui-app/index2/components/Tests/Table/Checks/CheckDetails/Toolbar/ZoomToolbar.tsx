/* eslint-disable prefer-arrow-callback,react/jsx-one-expression-per-line */
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActionIcon, Button, Group, Kbd, Popover, Stack, Text, Tooltip } from '@mantine/core';
import { IconChevronDown, IconZoomIn, IconZoomOut } from '@tabler/icons-react';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { fabric } from 'fabric';
import { MainView } from '../Canvas/mainView';

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
    const calculateMaxImagesDimensions = (): { imageName: string, dimension: string, value: number } => {
        const data: any = [
            { imageName: 'expectedImage', dimension: 'width', value: mainView.expectedImage.width },
            { imageName: 'expectedImage', dimension: 'height', value: mainView.expectedImage.height },
            { imageName: 'actualImage', dimension: 'width', value: mainView.actualImage.width },
            { imageName: 'actualImage', dimension: 'height', value: mainView.actualImage.height },
        ];
        const biggestDimensionValue = Math.max(...data.map((x: any) => x.value));
        return data.find((x: any) => x.value === biggestDimensionValue);
    };

    const zoomByPercent = (percent: number) => {
        if (!mainView?.canvas) return;
        // mainView.canvas.zoomToPoint(new fabric.Point(mainView.canvas.width / 2,
        //     30), percent / 100);
        //
        mainView.canvas.zoomToPoint(
            new fabric.Point(
                // mainView.canvas.viewportTransform[4],
                mainView.canvas.width / 2,
                mainView.canvas.viewportTransform[5],
            ),
            percent / 100,
        );
        document.dispatchEvent(new Event('zoom'));
        // mainView.canvas.renderAll(); console.log('render!!!');
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
        // mainView.canvas.renderAll(); console.log('render!!!');
    };

    const fitImageToCanvasIfNeeded = (imageName: string) => {
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

    const resizeImageIfNeeded = () => {
        const initPan = (imageName: string) => {
            setTimeout(() => {
                mainView.panToCanvasWidthCenter(imageName);
            }, 10);
        };

        const greatestImage = calculateMaxImagesDimensions();
        // small images
        if (mainView.canvas[greatestImage.dimension] / greatestImage.value > 7) {
            zoomByPercent(350);
            initPan(greatestImage.imageName);
            return;
        }
        // normal images (less than canvas)
        if (greatestImage.value < mainView.canvas[greatestImage.dimension]) {
            initPan(greatestImage.imageName);
            return;
        }

        // large images
        zoomTo(mainView[greatestImage.imageName as keyof MainView], greatestImage.dimension);

        const anotherDimension = (greatestImage.dimension === 'height') ? 'width' : 'height';

        if (
            (mainView[greatestImage.imageName as keyof MainView][anotherDimension] * mainView.canvas.getZoom())
            > mainView.canvas[anotherDimension]!
        ) {
            zoomTo(mainView[greatestImage.imageName as keyof MainView], anotherDimension);
        }

        initPan(greatestImage.imageName);
    };

    useEffect(function oneTime() {
        const zoomEventHandler = () => setZoomPercent(window.mainView.canvas.getZoom() * 100);
        document.addEventListener('zoom', zoomEventHandler, false);
        return () => document.removeEventListener('zoom', zoomEventHandler, false);
    }, []);

    useEffect(
        function initZoom() {
            if (mainView) {
                // zoomEvents();
                resizeImageIfNeeded();
            }
        },
        [mainView?.toString()],
    );

    useHotkeys([
        // Zoom
        ['Equal', () => zoomByDelta(15)],
        ['NumpadAdd', () => zoomByDelta(15)],
        ['Minus', () => zoomByDelta(-15)],
        ['NumpadSubtract', () => zoomByDelta(-15)],
        ['Digit9', () => fitImageByWith(`${view}Image`)],
        ['Digit0', () => {
            if (view === 'slider') {
                fitImageToCanvasIfNeeded('actualImage');
                return;
            }
            fitImageToCanvasIfNeeded(`${view}Image`);
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
                    data-check="zoom-in"
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
                        <ActionIcon ml={-10} data-check="open-zoom-dropdown">
                            <IconChevronDown />
                        </ActionIcon>
                    </Group>
                </Popover.Target>
                <Popover.Dropdown p={0}>
                    <Stack spacing={0} data-check="zoom-dropdown">
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
                            styles={{
                                label: {
                                    width: '100%',
                                },
                            }}
                            // sx={{ width: '100%' }}
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
                            <Group sx={{ width: '100%' }} position="apart" noWrap>
                                Fit by width <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>9</Kbd>
                            </Group>
                        </Button>

                        <Button
                            styles={{
                                label: {
                                    width: '100%',
                                },
                            }}
                            pl={8}
                            pr={8}
                            variant="subtle"
                            onClick={() => {
                                zoomPopoverHandler.close();

                                if (view === 'slider') {
                                    fitImageToCanvasIfNeeded('actualImage');
                                    return;
                                }
                                fitImageToCanvasIfNeeded(`${view}Image`);
                            }}
                        >
                            <Group sx={{ width: '100%' }} position="apart" noWrap>
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
                    data-check="zoom-out"
                    onClick={() => zoomByDelta(-15)}
                >
                    <IconZoomOut size={24} stroke={1} />
                </ActionIcon>
            </Tooltip>
        </>
    );
}
