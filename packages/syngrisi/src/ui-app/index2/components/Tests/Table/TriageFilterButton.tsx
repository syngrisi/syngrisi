import * as React from 'react';
import { useState } from 'react';
import { ActionIcon, Popover, Stack, Select, NumberInput, TextInput, Button, Group, Text, Indicator } from '@mantine/core';
import { IconSparkles } from '@tabler/icons-react';
import { useParams } from '@hooks/useParams';

// Compact AI Triage filter: verdict / min confidence / reason substring.
// Writes the `checkFilter` URL param; checks are filtered client-side in Checks.tsx.
export function TriageFilterButton() {
    const { query, setQuery } = useParams();
    const cf: any = (query.checkFilter && typeof query.checkFilter === 'object') ? query.checkFilter : {};
    const [opened, setOpened] = useState(false);
    const [verdict, setVerdict] = useState<string | null>(cf['triage.verdict'] ?? null);
    const [minConfidence, setMinConfidence] = useState<number | ''>(typeof cf.minConfidence === 'number' ? cf.minConfidence : '');
    const [reason, setReason] = useState<string>(cf.reasonContains ?? '');

    const active = !!(cf['triage.verdict'] || typeof cf.minConfidence === 'number' || cf.reasonContains);

    const apply = () => {
        const next: any = {};
        if (verdict) next['triage.verdict'] = verdict;
        if (typeof minConfidence === 'number') next.minConfidence = minConfidence;
        if (reason.trim()) next.reasonContains = reason.trim();
        setQuery({ checkFilter: Object.keys(next).length ? next : null });
        setOpened(false);
    };

    const clear = () => {
        setVerdict(null);
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
                        color={active ? 'green' : 'gray'}
                        data-test="triage-filter-button"
                    >
                        <IconSparkles size={24} stroke={1} />
                    </ActionIcon>
                </Indicator>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack gap="xs" style={{ width: 240 }} data-test="triage-filter-popover">
                    <Text size="sm" fw={600}>AI Triage filter</Text>
                    <Select
                        label="Verdict"
                        placeholder="any"
                        clearable
                        value={verdict}
                        onChange={setVerdict}
                        data-test="triage-filter-verdict"
                        data={[
                            { value: 'intended_change', label: 'Intended change' },
                            { value: 'likely_bug', label: 'Likely bug' },
                            { value: 'noise', label: 'Noise' },
                            { value: 'uncertain', label: 'Uncertain' },
                        ]}
                    />
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
