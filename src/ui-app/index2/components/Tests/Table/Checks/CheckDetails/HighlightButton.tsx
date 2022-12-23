import * as React from 'react';
import { ActionIcon, Group, Text, Tooltip } from '@mantine/core';
import { IconBulb } from '@tabler/icons';
import { useState } from 'react';
import { highlightDiff, IGroup } from './highlightDiff';
import { MainView } from './mainView';

interface Props {
    mainView: MainView,
    disabled?: boolean
}

export function HighlightButton({ mainView, disabled = false }: Props) {
    const [loadHighlights, setLoadHighlights] = useState(false);
    const [highlightsGroups, setHighlightsGroups] = useState<IGroup[] | null>(null);
    const [imageData, setImageData] = useState(null);
    const label = disabled
        ? (
            <Group noWrap>
                <Text>
                    Difference highlighting, active in diff mode when
                    the difference is less than 5%
                </Text>
            </Group>
        )
        : (
            <Group noWrap>
                <Text>Difference highlighting</Text>
            </Group>
        );
    return (
        <Tooltip
            withinPortal
            label={
                label
            }
        >
            <div>
                <ActionIcon
                    data-check="highlight-icon"
                    disabled={disabled}
                    loading={loadHighlights}
                    onClick={async () => {
                        setLoadHighlights(() => true);
                        const { groups, diffImageData } = await highlightDiff(mainView, highlightsGroups, imageData);
                        setImageData(() => diffImageData);
                        setHighlightsGroups(() => groups);
                        setLoadHighlights(() => false);
                    }}
                >
                    <IconBulb size={24} stroke={1} />
                </ActionIcon>
            </div>
        </Tooltip>
    );
}
