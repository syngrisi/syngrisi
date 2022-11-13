import * as React from 'react';
import { ActionIcon, Group, Text, Tooltip } from '@mantine/core';
import { IconBulb } from '@tabler/icons';
import { useState } from 'react';
import { highlightDiff, IGroup } from './highlightDiff';
import { MainView } from './mainView';

interface Props {
    mainView: MainView,
}

export function HighlightButton({ mainView }: Props) {
    const [loadHighlights, setLoadHighlights] = useState(false);
    const [highlightsGroups, setHighlightsGroups] = useState<IGroup[] | null>(null);
    const [imageData, setImageData] = useState(null);
    return (
        <Tooltip
            withinPortal
            label={
                (
                    <Group noWrap>
                        <Text>Difference highlighting</Text>
                    </Group>
                )
            }
        >
            <ActionIcon
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
        </Tooltip>
    );
}
