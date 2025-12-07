/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { ActionIcon, Menu, Text, Tooltip, Group } from '@mantine/core';
import { IconWand, IconCheck } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import config from '@config';
import { successMsg, errorMsg } from '@shared/utils/utils';
import { log } from '@shared/utils/Logger';

interface Props {
    baselineId: string;
    initialMatchType?: string;
}

type MatchType = 'nothing' | 'antialiasing' | 'colors';

const MATCH_TYPE_OPTIONS: { value: MatchType; label: string; description: string }[] = [
    {
        value: 'nothing',
        label: 'Standard',
        description: 'Compare all pixels exactly',
    },
    {
        value: 'antialiasing',
        label: 'Ignore Anti-aliasing',
        description: 'Automatically ignore anti-aliasing differences',
    },
    {
        value: 'colors',
        label: 'Ignore Colors',
        description: 'Compare structure, ignore color differences',
    },
];

async function updateMatchType(baselineId: string, matchType: MatchType): Promise<boolean> {
    try {
        const response = await fetch(`${config.baseUri}/v1/baselines/${baselineId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matchType }),
        });

        if (response.status === 200) {
            log.debug(`Successfully updated match type to '${matchType}' for baseline ${baselineId}`);
            successMsg({ message: `Match type set to: ${matchType}` });
            return true;
        }
        log.error(`Cannot update match type, status: ${response.status}`);
        errorMsg({ error: 'Cannot update match type' });
        return false;
    } catch (e) {
        log.error(`Cannot update match type: ${e}`);
        errorMsg({ error: 'Cannot update match type' });
        return false;
    }
}

async function fetchBaseline(baselineId: string): Promise<{ matchType?: MatchType } | null> {
    try {
        const url = `${config.baseUri}/v1/baselines?filter={"_id":"${baselineId}"}`;
        const response = await fetch(url);
        if (response.status === 200) {
            const data = await response.json();
            return data.results?.[0] || null;
        }
        return null;
    } catch (e) {
        log.error(`Cannot fetch baseline: ${e}`);
        return null;
    }
}

export function MatchTypeSelector({ baselineId, initialMatchType }: Props) {
    const [matchType, setMatchType] = useState<MatchType>(initialMatchType as MatchType || 'nothing');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (baselineId && !initialMatchType) {
            fetchBaseline(baselineId).then((baseline) => {
                if (baseline?.matchType) {
                    setMatchType(baseline.matchType);
                }
            });
        }
    }, [baselineId, initialMatchType]);

    const handleSelect = async (value: MatchType) => {
        setLoading(true);
        const success = await updateMatchType(baselineId, value);
        if (success) {
            setMatchType(value);
        }
        setLoading(false);
    };

    const currentOption = MATCH_TYPE_OPTIONS.find((opt) => opt.value === matchType);

    return (
        <Menu shadow="md" width={220} withinPortal>
            <Menu.Target>
                <Tooltip
                    label={
                        <Group spacing={4}>
                            <Text>Auto-ignore mode: {currentOption?.label}</Text>
                        </Group>
                    }
                >
                    <ActionIcon
                        data-check="match-type-selector"
                        disabled={!baselineId}
                        loading={loading}
                    >
                        <IconWand size={24} stroke={1} />
                    </ActionIcon>
                </Tooltip>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Auto-ignore Mode</Menu.Label>
                {MATCH_TYPE_OPTIONS.map((option) => (
                    <Menu.Item
                        key={option.value}
                        icon={matchType === option.value ? <IconCheck size={14} /> : null}
                        onClick={() => handleSelect(option.value)}
                    >
                        <Text size="sm" weight={matchType === option.value ? 600 : 400}>
                            {option.label}
                        </Text>
                        <Text size="xs" color="dimmed">
                            {option.description}
                        </Text>
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}
