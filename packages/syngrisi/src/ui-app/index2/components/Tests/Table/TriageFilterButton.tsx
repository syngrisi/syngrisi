import * as React from 'react';
import { useEffect, useState } from 'react';
import { ActionIcon, Popover, Stack, Checkbox, NumberInput, TextInput, Button, Group, Text, Indicator } from '@mantine/core';
import { IconSparkles2 } from '@tabler/icons-react';
import { useParams } from '@hooks/useParams';

const VERDICT_OPTIONS = [
    { value: 'intended_change', label: 'Intended change' },
    { value: 'likely_bug', label: 'Likely bug' },
    { value: 'noise', label: 'Noise' },
    { value: 'uncertain', label: 'Uncertain' },
    { value: 'unknown', label: 'Unknown' },
];

const toArray = (v: any): string[] => (Array.isArray(v) ? v.filter(Boolean) : (v ? [v] : []));

// Compact AI Triage filter: verdict / min confidence / reason substring.
// Writes the `checkFilter` URL param; checks are filtered client-side in Checks.tsx.
export function TriageFilterButton() {
    const { query, setQuery } = useParams();
    const cf: any = (query.checkFilter && typeof query.checkFilter === 'object') ? query.checkFilter : {};
    const [opened, setOpened] = useState(false);
    const [verdicts, setVerdicts] = useState<string[]>(toArray(cf['triage.verdict']));
    const [minConfidence, setMinConfidence] = useState<number | ''>(typeof cf.minConfidence === 'number' ? cf.minConfidence : '');
    const [reason, setReason] = useState<string>(cf.reasonContains ?? '');

    const active = !!(toArray(cf['triage.verdict']).length || typeof cf.minConfidence === 'number' || cf.reasonContains);

    // Sync local controls with the active filter whenever the popover opens (e.g. after the filter
    // was changed by clicking a verdict badge), so the checkboxes reflect the current state.
    useEffect(() => {
        if (!opened) return;
        setVerdicts(toArray(cf['triage.verdict']));
        setMinConfidence(typeof cf.minConfidence === 'number' ? cf.minConfidence : '');
        setReason(cf.reasonContains ?? '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened]);

    const apply = () => {
        const next: any = {};
        if (verdicts.length) next['triage.verdict'] = verdicts;
        if (typeof minConfidence === 'number') next.minConfidence = minConfidence;
        if (reason.trim()) next.reasonContains = reason.trim();
        setQuery({ checkFilter: Object.keys(next).length ? next : null });
        setOpened(false);
    };

    const clear = () => {
        setVerdicts([]);
        setMinConfidence('');
        setReason('');
        setQuery({ checkFilter: null });
        setOpened(false);
    };

    return (
        <Popover opened={opened} onChange={setOpened} position="bottom-end" withArrow shadow="md" trapFocus>
            <Popover.Target>
                <Indicator disabled={!active} color="green" size={8} offset={4}>
                    <ActionIcon
                        onClick={() => setOpened((o) => !o)}
                        title="Filter by AI verdict"
                        aria-label="Filter by AI verdict"
                        variant={active ? 'light' : 'transparent'}
                        color="yellow"
                        data-test="triage-filter-button"
                    >
                        {/* gold AI icon — highlights the AI feature in the toolbar */}
                        <IconSparkles2 size={24} stroke={1.5} color="#E0A100" fill={active ? '#F2C744' : 'none'} />
                    </ActionIcon>
                </Indicator>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack gap="xs" style={{ width: 240 }} data-test="triage-filter-popover">
                    <Text size="sm" fw={600}>AI Triage filter</Text>
                    <Checkbox.Group
                        label="Verdicts"
                        value={verdicts}
                        onChange={setVerdicts}
                        data-test="triage-filter-verdict"
                    >
                        <Stack gap={6} mt={6}>
                            {VERDICT_OPTIONS.map((o) => (
                                <Checkbox key={o.value} value={o.value} label={o.label} data-test={`triage-filter-verdict-${o.value}`} />
                            ))}
                        </Stack>
                    </Checkbox.Group>
                    <NumberInput
                        label="Min confidence"
                        placeholder="0..10"
                        min={0}
                        max={10}
                        value={minConfidence}
                        onChange={(v) => setMinConfidence(typeof v === 'number' ? v : '')}
                        data-test="triage-filter-confidence"
                    />
                    <TextInput
                        label="Reason contains"
                        placeholder="e.g. banner"
                        value={reason}
                        onChange={(e) => setReason(e.currentTarget.value)}
                        data-test="triage-filter-reason"
                    />
                    <Group justify="space-between" mt={4}>
                        <Button size="xs" variant="default" onClick={clear} data-test="triage-filter-clear">Clear</Button>
                        <Button size="xs" onClick={apply} data-test="triage-filter-apply">Apply</Button>
                    </Group>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
