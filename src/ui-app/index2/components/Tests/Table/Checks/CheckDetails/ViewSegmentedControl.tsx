import * as React from 'react';
import { Group, Kbd, SegmentedControl, Text, Tooltip, createStyles } from '@mantine/core';
import { IconArrowsExchange2, IconSquareHalf, IconSquareLetterA, IconSquareLetterE } from '@tabler/icons';
import { useHotkeys } from '@mantine/hooks';

const useStyles = createStyles((theme) => ({
    labelIcon: {
        minWidth: 18,
    },
    labelText: {
        [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
            display: 'none',
        },
    },
}));

interface Props {
    view: string
    setView: any
    currentCheck: any
    // viewSegmentData: any
}

export function ViewSegmentedControl({ view, setView, currentCheck }: Props) {
    const { classes } = useStyles();

    useHotkeys([
        // View
        ['Digit1', () => setView('expected')],
        ['Digit2', () => setView('actual')],
        ['Digit3', () => {
            if (currentCheck?.diffId?.filename) setView('diff');
        }],
        ['Digit4', () => {
            if (currentCheck?.diffId?.filename) setView('slider');
        }],
    ]);

    const viewSegmentData = [
        {
            label: (
                <Tooltip
                    withinPortal
                    label={
                        (
                            <Group noWrap>
                                <Text>Switch to Expected View</Text>
                                <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>1</Kbd>
                            </Group>
                        )
                    }
                >
                    <Group position="left" spacing={4} noWrap>
                        <IconSquareLetterE stroke={1} className={classes.labelIcon} />
                        <Text lineClamp={1} className={classes.labelText}>
                            Expected
                        </Text>
                    </Group>
                </Tooltip>
            ),
            value: 'expected',
        },
        {
            label: (
                <Tooltip
                    withinPortal
                    label={
                        (
                            <Group noWrap>
                                <Text>Switch to Actual View</Text>
                                <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>2</Kbd>
                            </Group>
                        )
                    }
                >
                    <Group position="left" spacing={4} noWrap>
                        <IconSquareLetterA stroke={1} className={classes.labelIcon} />
                        <Text lineClamp={1} className={classes.labelText}>
                            Actual
                        </Text>
                    </Group>
                </Tooltip>
            ),
            value: 'actual',
        },
        {
            label:
                (
                    <Tooltip
                        withinPortal
                        label={
                            (
                                <Group noWrap>
                                    <Text>Switch to Difference View</Text>
                                    <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>3</Kbd>
                                </Group>
                            )
                        }
                    >
                        <Group position="left" spacing={4} noWrap>
                            <IconArrowsExchange2 stroke={1} className={classes.labelIcon} />
                            <Text lineClamp={1} className={classes.labelText}>
                                Difference
                            </Text>
                        </Group>
                    </Tooltip>
                ),
            value: 'diff',
            disabled: true,
        },
        {
            label:
                (
                    <Tooltip
                        withinPortal
                        label={
                            (
                                <Group noWrap>
                                    <Text>Switch to Slider View</Text>
                                    <Kbd sx={{ fontSize: 11, borderBottomWidth: 1 }}>4</Kbd>
                                </Group>
                            )
                        }
                    >
                        <Group position="left" spacing={4} noWrap>
                            <IconSquareHalf stroke={1} className={classes.labelIcon} />
                            <Text lineClamp={1} className={classes.labelText}>
                                Slider
                            </Text>
                        </Group>
                    </Tooltip>
                ),
            value: 'slider',
            disabled: true,
        },
    ];

    // disable the slider and diff if diff not exist
    if (currentCheck?.diffId?.filename) {
        viewSegmentData[2].disabled = false;
        viewSegmentData[3].disabled = false;
    }
    return (
        <SegmentedControl
            sx={{ minWidth: 0, minHeight: 0 }}
            styles={
                {
                    label: {
                        minWidth: 0,
                        minHeight: 0,
                        // overflow: 'hidden',
                        fontSize: 'calc(0.1em + 0.55vw)',
                        maxWidth: '7vw',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    },
                }
            }
            value={view}
            onChange={setView}
            data={viewSegmentData}
        />
    );
}
