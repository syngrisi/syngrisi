/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { ActionIcon, Menu, Text, Tooltip, Group, NumberInput, Button, Stack, Divider } from '@mantine/core';
import { IconAdjustments, IconCheck } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import config from '@config';
import { successMsg, errorMsg } from '@shared/utils/utils';
import { log } from '@shared/utils/Logger';
import { ChecksService } from '@shared/services';

interface Props {
    baselineId: string;
    initialMatchType?: string;
    baselineData?: BaselineSettingsResponse | null;
    checkId?: string;
    currentCheck?: any;
    initialCheckId?: string;
    apikey?: string;
    checkQuery?: any;
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

type BaselineSettingsResponse = { matchType?: MatchType; toleranceThreshold?: number };

const clampThreshold = (value: number): number => {
    if (!Number.isFinite(value)) return 0;
    const clamped = Math.max(0, Math.min(100, value));
    return Number(clamped.toFixed(2));
};

const buildHeaders = (apikey?: string): Record<string, string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apikey) headers.apikey = apikey;
    return headers;
};

async function updateBaselineSettings(
    baselineId: string,
    payload: { matchType: MatchType; toleranceThreshold: number },
    apikey?: string
): Promise<boolean> {
    try {
        const response = await fetch(`${config.baseUri}/v1/baselines/${baselineId}`, {
            method: 'PUT',
            headers: buildHeaders(apikey),
            body: JSON.stringify(payload),
        });

        if (response.status === 200) {
            log.debug(`Successfully updated baseline settings for baseline ${baselineId}`);
            return true;
        }
        log.error(`Cannot update baseline settings, status: ${response.status}`);
        errorMsg({ error: 'Cannot update baseline settings' });
        return false;
    } catch (e) {
        log.error(`Cannot update baseline settings: ${e}`);
        errorMsg({ error: 'Cannot update baseline settings' });
        return false;
    }
}

async function fetchBaseline(baselineId: string, apikey?: string): Promise<BaselineSettingsResponse | null> {
    try {
        const url = `${config.baseUri}/v1/baselines?filter={"_id":"${baselineId}"}`;
        const response = await fetch(url, { headers: apikey ? { apikey } : {} });
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

export function MatchTypeSelector({
    baselineId,
    initialMatchType,
    baselineData,
    checkId,
    currentCheck,
    initialCheckId,
    apikey,
    checkQuery,
}: Props) {
    const queryClient = useQueryClient();
    const [matchType, setMatchType] = useState<MatchType>(initialMatchType as MatchType || 'nothing');
    const [toleranceThreshold, setToleranceThreshold] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (baselineData) {
            if (baselineData.matchType) {
                setMatchType(baselineData.matchType);
            } else if (initialMatchType) {
                setMatchType(initialMatchType as MatchType);
            }
            setToleranceThreshold(clampThreshold(Number(baselineData.toleranceThreshold || 0)));
            return;
        }

        if (baselineId && !initialMatchType) {
            fetchBaseline(baselineId, apikey).then((baseline) => {
                if (baseline?.matchType) {
                    setMatchType(baseline.matchType);
                }
                setToleranceThreshold(clampThreshold(Number(baseline?.toleranceThreshold || 0)));
            });
            return;
        }

        if (initialMatchType) {
            setMatchType(initialMatchType as MatchType);
        }
    }, [baselineId, initialMatchType, apikey, baselineData]);

    const handleAutoCalc = () => {
        const rawMismatch = Number(currentCheck?.parsedResult?.rawMisMatchPercentage);
        if (!Number.isFinite(rawMismatch)) {
            errorMsg({ error: 'Cannot auto-calculate tolerance: mismatch value is missing' });
            return;
        }
        setToleranceThreshold(clampThreshold(rawMismatch + 0.01));
    };

    const handleSave = async () => {
        if (!baselineId) return;
        setLoading(true);
        const success = await updateBaselineSettings(
            baselineId,
            {
                matchType,
                toleranceThreshold: clampThreshold(toleranceThreshold),
            },
            apikey,
        );

        if (success) {
            successMsg({ message: `Baseline settings updated` });
            if (checkId) {
                try {
                    await ChecksService.recompareCheck({ id: checkId, apikey });
                    successMsg({ message: 'Check was re-compared with current baseline settings' });
                } catch (e) {
                    log.error(`Cannot recompare check: ${e}`);
                    errorMsg({ error: 'Cannot recompare check after updating baseline settings' });
                }
            }
            if (currentCheck?.baselineId?._id) {
                await queryClient.invalidateQueries({ queryKey: ['baseline_by_snapshot_id', currentCheck.baselineId._id] });
            }
            await queryClient.invalidateQueries({ queryKey: ['check_for_modal', checkId], exact: true });
            if (checkQuery?.refetch) {
                await checkQuery.refetch();
            }
            const testId = currentCheck?.test?._id || currentCheck?.test;
            if (testId) {
                await queryClient.invalidateQueries({ queryKey: ['preview_checks', testId], exact: true });
            }
            await queryClient.refetchQueries({ queryKey: ['related_checks_infinity_pages', initialCheckId || checkId] });
        }
        setLoading(false);
    };

    const currentOption = MATCH_TYPE_OPTIONS.find((opt) => opt.value === matchType);

    return (
        <Menu shadow="md" width={220} withinPortal>
            <Menu.Target>
                <Tooltip
                    label={
                        <Group gap={4}>
                            <Text>Auto-ignore mode: {currentOption?.label}</Text>
                        </Group>
                    }
                >
                    <ActionIcon
                        data-check="match-type-selector"
                        disabled={!baselineId}
                        loading={loading}
                        variant="transparent"
                        color="gray"
                        size={32}
                    >
                        <IconAdjustments size={20} stroke={1} />
                    </ActionIcon>
                </Tooltip>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Auto-ignore Mode</Menu.Label>
                {MATCH_TYPE_OPTIONS.map((option) => (
                    <Menu.Item
                        key={option.value}
                        leftSection={matchType === option.value ? <IconCheck size={14} /> : null}
                        onClick={() => setMatchType(option.value)}
                    >
                        <Text size="sm" fw={matchType === option.value ? 600 : 400}>
                            {option.label}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {option.description}
                        </Text>
                    </Menu.Item>
                ))}
                <Divider my="xs" />
                <Stack gap="xs" px="xs" pb="xs">
                    <Text size="xs" c="dimmed">Tolerance threshold (%)</Text>
                    <NumberInput
                        data-check="tolerance-threshold-input"
                        value={toleranceThreshold}
                        onChange={(value) => setToleranceThreshold(clampThreshold(Number(value || 0)))}
                        min={0}
                        max={100}
                        step={0.01}
                        precision={2}
                    />
                    <Group grow>
                        <Button
                            size="xs"
                            variant="default"
                            onClick={handleAutoCalc}
                            data-check="tolerance-auto-calc"
                        >
                            Auto-calc
                        </Button>
                        <Button
                            size="xs"
                            onClick={handleSave}
                            loading={loading}
                            data-check="tolerance-save"
                        >
                            Save
                        </Button>
                    </Group>
                </Stack>
            </Menu.Dropdown>
        </Menu>
    );
}
