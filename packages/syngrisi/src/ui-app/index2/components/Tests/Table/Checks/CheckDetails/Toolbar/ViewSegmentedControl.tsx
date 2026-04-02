import * as React from 'react';
import { Group, Kbd, SegmentedControl, Text, Tooltip } from '@mantine/core';
import { IconArrowsExchange2, IconSquareHalf, IconSquareLetterA, IconSquareLetterE } from '@tabler/icons-react';
import { useHotkeys } from '@mantine/hooks';
import { useEffect, useRef } from 'react';

const labelIconStyle: React.CSSProperties = {
    minWidth: 18,
};

interface Props {
    view: string
    setView: any
    currentCheck: any
}

export function ViewSegmentedControl({ view, setView, currentCheck }: Props) {
    const segmentRef = useRef<HTMLDivElement>(null);

    const isExpectedDisabled = currentCheck?.status[0] === 'new';
    const isDiffDisabled = !currentCheck?.diffId?.filename;
    const isSliderDisabled = !currentCheck?.diffId?.filename;

    useHotkeys([
        ['Digit1', () => setView('expected')],
        ['Digit2', () => setView('actual')],
        ['Digit3', () => {
            if (currentCheck?.diffId?.filename) setView('diff');
        }],
        ['Digit4', () => {
            if (currentCheck?.diffId?.filename) setView('slider');
        }],
    ]);

    useEffect(() => {
        if (!segmentRef.current) return;

        const segmentMap = {
            'expected': { disabled: isExpectedDisabled },
            'actual': { disabled: false },
            'diff': { disabled: isDiffDisabled },
            'slider': { disabled: isSliderDisabled },
        };

        Object.entries(segmentMap).forEach(([value, { disabled }]) => {
            const segmentElement = segmentRef.current?.querySelector(`[data-check="${value}-view"]`)?.closest('label');
            if (segmentElement) {
                segmentElement.setAttribute('data-segment-value', value);
                segmentElement.setAttribute('data-segment-active', value === view ? 'true' : 'false');
                segmentElement.setAttribute('data-segment-disabled', disabled ? 'true' : 'false');
            }
        });
    }, [view, isExpectedDisabled, isDiffDisabled, isSliderDisabled]);

    const kbdStyle: React.CSSProperties = { fontSize: 11, borderBottomWidth: 1 };

    const viewSegmentData = [
        {
            label: (
                <Tooltip
                    withinPortal
                    label={
                        (
                            <Group wrap="nowrap">
                                <Text>Switch to Expected View</Text>
                                <Kbd style={kbdStyle}>1</Kbd>
                            </Group>
                        )
                    }
                >
                    <Group justify="flex-start" gap={4} wrap="nowrap" data-check="expected-view">
                        <IconSquareLetterE stroke={1} style={labelIconStyle} />
                    </Group>
                </Tooltip>
            ),
            value: 'expected',
            disabled: isExpectedDisabled,
        },
        {
            label: (
                <Tooltip
                    withinPortal
                    label={
                        (
                            <Group wrap="nowrap">
                                <Text>Switch to Actual View</Text>
                                <Kbd style={kbdStyle}>2</Kbd>
                            </Group>
                        )
                    }
                >
                    <Group justify="flex-start" gap={4} wrap="nowrap" data-check="actual-view">
                        <IconSquareLetterA stroke={1} style={labelIconStyle} />
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
                                <Group wrap="nowrap">
                                    <Text>Switch to Difference View</Text>
                                    <Kbd style={kbdStyle}>3</Kbd>
                                </Group>
                            )
                        }
                    >
                        <Group justify="flex-start" gap={4} wrap="nowrap" data-check="diff-view">
                            <IconArrowsExchange2 stroke={1} style={labelIconStyle} />
                        </Group>
                    </Tooltip>
                ),
            value: 'diff',
            disabled: isDiffDisabled,
        },
        {
            label:
                (
                    <Tooltip
                        withinPortal
                        label={
                            (
                                <Group wrap="nowrap">
                                    <Text>Switch to Slider View</Text>
                                    <Kbd style={kbdStyle}>4</Kbd>
                                </Group>
                            )
                        }
                    >
                        <Group justify="flex-start" gap={4} wrap="nowrap" data-check="slider-view">
                            <IconSquareHalf stroke={1} style={labelIconStyle} />
                        </Group>
                    </Tooltip>
                ),
            value: 'slider',
            disabled: isSliderDisabled,
        },
    ];

    return (
        <div ref={segmentRef}>
            <SegmentedControl
                data-check="view-segment"
                style={{ minWidth: 0, minHeight: 0 }}
                styles={
                    {
                        label: {
                            minWidth: 0,
                            minHeight: 0,
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
        </div>
    );
}
