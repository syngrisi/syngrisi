/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
    ScrollArea, Box, Title, Paper, Select, Switch, NumberInput, MultiSelect, Button, Group, Table,
    TextInput, Checkbox, ActionIcon, Text, Divider, ColorInput, Loader,
} from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useSubpageEffect } from '@shared/hooks';
import { GenericService } from '@shared/services';
import { http } from '@shared/lib/http';
import config from '@config';
import { errorMsg, successMsg } from '@shared/utils/utils';
import { AIProviderSettingsForm } from '@admin/components/Settings/AIProviderSettingsForm';
import { TriageIcon, TRIAGE_ICON_NAMES } from '@shared/components/Check/triageIcons';
import { HelpDoc } from '@admin/components/AI/HelpDoc';

type Verdict = {
    key: string; label: string; color: string; icon?: string; severity: number;
    autoAcceptable: boolean; neverAutoAccept?: boolean; isFallback?: boolean; description?: string;
};

// Mirror of server defaults — starting point when a project has no custom set yet.
const DEFAULT_VERDICTS: Verdict[] = [
    { key: 'noise', label: 'Noise', color: 'gray', icon: 'wave', severity: 1, autoAcceptable: true, description: 'render jitter / dynamic content' },
    { key: 'intended_change', label: 'Intended change', color: 'green', icon: 'check', severity: 2, autoAcceptable: true, description: 'a real intentional change' },
    { key: 'uncertain', label: 'Uncertain', color: 'yellow', icon: 'question', severity: 3, autoAcceptable: false, neverAutoAccept: true, isFallback: true, description: 'not confident' },
    { key: 'likely_bug', label: 'Likely bug', color: 'red', icon: 'bug', severity: 4, autoAcceptable: false, neverAutoAccept: true, description: 'an unexpected regression' },
];

const ICON_OPTIONS = TRIAGE_ICON_NAMES.map((n) => ({ value: n, label: n }));

function PerProjectTriage() {
    const appsQuery = useQuery({ queryKey: ['apps-for-triage'], queryFn: () => GenericService.get('app', {}, { limit: '0' }) });
    const apps: any[] = appsQuery.data?.results || [];
    const [appId, setAppId] = useState<string | null>(null);
    const selected = useMemo(() => apps.find((a) => a._id === appId), [apps, appId]);

    const [enabled, setEnabled] = useState(false);
    const [mode, setMode] = useState<string>('suggest');
    const [threshold, setThreshold] = useState<number>(9);
    const [allow, setAllow] = useState<string[]>([]);
    const [verdicts, setVerdicts] = useState<Verdict[]>(DEFAULT_VERDICTS);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!selected) return;
        setEnabled(selected.triageEnabled === true);
        setMode(selected.triagePolicy?.policy || 'suggest');
        setThreshold(typeof selected.triagePolicy?.autoAcceptThreshold === 'number' ? selected.triagePolicy.autoAcceptThreshold : 9);
        setAllow(selected.triagePolicy?.autoAcceptVerdicts || ['intended_change', 'noise']);
        setVerdicts(Array.isArray(selected.triageVerdicts) && selected.triageVerdicts.length ? selected.triageVerdicts : DEFAULT_VERDICTS);
    }, [selected]);

    const update = (i: number, patch: Partial<Verdict>) => setVerdicts((v) => v.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
    const remove = (i: number) => setVerdicts((v) => v.filter((_, idx) => idx !== i));
    const add = () => setVerdicts((v) => [...v, { key: '', label: '', color: 'blue', icon: 'flag', severity: v.length + 1, autoAcceptable: false }]);

    const save = async () => {
        if (!appId) return;
        const keys = verdicts.map((v) => v.key.trim()).filter(Boolean);
        if (keys.length === 0) { errorMsg({ error: 'At least one verdict is required' }); return; }
        if (new Set(keys).size !== keys.length) { errorMsg({ error: 'Verdict keys must be unique' }); return; }
        if (!verdicts.some((v) => v.isFallback)) { errorMsg({ error: 'Exactly one verdict must be marked as fallback' }); return; }
        setSaving(true);
        try {
            const resp = await http.patch(`${config.baseUri}/v1/app/${appId}/triage-policy`, {
                triageEnabled: enabled,
                triagePolicy: { policy: mode, autoAcceptThreshold: threshold, autoAcceptVerdicts: allow },
                triageVerdicts: verdicts,
            }, {}, 'AdminAI.savePerProject');
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            successMsg({ message: 'Project AI Triage config saved' });
            appsQuery.refetch();
        } catch (e) {
            errorMsg({ error: e });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Paper withBorder p={20} m={15} style={{ width: '90%' }} data-test="ai-perproject-form">
            <Group gap={6} mb="md">
                <Title order={4}>Per-project AI Triage</Title>
                <HelpDoc
                    title="Per-project AI Triage"
                    lines={[
                        'AI Triage is enabled per project and is OFF by default. Background triage only runs for enabled projects; manual re-run always works.',
                        'Policy "auto" auto-accepts allowed verdicts at/above the confidence threshold. Verdicts flagged "never" (e.g. likely bug) are never auto-accepted.',
                        'Verdicts are fully customizable per project: key, label, icon, color, severity (worst wins for grouping) and the auto/never/fallback flags.',
                    ]}
                    docHref="https://github.com/syngrisi/syngrisi/blob/main/packages/syngrisi/AI_TRIAGE.md"
                />
            </Group>
            <Select
                label="Project"
                placeholder={appsQuery.isLoading ? 'loading…' : 'select a project'}
                value={appId}
                onChange={setAppId}
                data-test="ai-project-select"
                data={apps.map((a) => ({ value: a._id, label: a.name }))}
                mb="md"
            />
            {!appId ? <Text size="sm" c="dimmed">Select a project to configure its verdicts and policy.</Text> : (
                <>
                    <Switch label="AI Triage enabled for this project" checked={enabled} onChange={(e) => setEnabled(e.currentTarget.checked)} data-test="ai-project-enabled" mb="md" />
                    <Group mb="md" align="end">
                        <Select label="Policy" value={mode} onChange={(v) => setMode(v || 'suggest')} data-test="ai-policy-mode"
                            data={[{ value: 'suggest', label: 'Suggest (UI only)' }, { value: 'auto', label: 'Auto-accept' }]} />
                        <NumberInput label="Auto-accept threshold" min={0} max={10} value={threshold} onChange={(v) => setThreshold(typeof v === 'number' ? v : 9)} data-test="ai-policy-threshold" w={180} disabled={mode === 'suggest'} />
                        <MultiSelect label="Auto-accept verdicts" value={allow} onChange={setAllow} data={verdicts.map((v) => ({ value: v.key, label: v.label || v.key }))} data-test="ai-policy-allow" style={{ flex: 1 }} disabled={mode === 'suggest'} />
                    </Group>
                    <Divider my="sm" label={(
                        <Group gap={4}>
                            <Text size="sm">Verdicts</Text>
                            <HelpDoc
                                title="Custom verdicts"
                                lines={[
                                    'Key: the value the model returns (lowercase, unique). Label/Icon/Color: how the verdict looks on badges.',
                                    'Severity: higher = worse; a test shows its worst check verdict for grouping.',
                                    'Auto = may be auto-accepted; Never = hard safety, never auto-accepted; Fallback = used when the model output is unparseable (exactly one required).',
                                ]}
                            />
                        </Group>
                    )}
                    />
                    <Table data-test="ai-verdicts-table">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Key</Table.Th><Table.Th>Label</Table.Th><Table.Th>Icon</Table.Th><Table.Th>Color</Table.Th>
                                <Table.Th>Severity</Table.Th><Table.Th>Auto</Table.Th><Table.Th>Never</Table.Th><Table.Th>Fallback</Table.Th><Table.Th /></Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {verdicts.map((v, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <Table.Tr key={i} data-test="ai-verdict-row">
                                    <Table.Td><TextInput value={v.key} onChange={(e) => update(i, { key: e.currentTarget.value })} placeholder="key" /></Table.Td>
                                    <Table.Td><TextInput value={v.label} onChange={(e) => update(i, { label: e.currentTarget.value })} placeholder="Label" /></Table.Td>
                                    <Table.Td>
                                        <Select
                                            value={v.icon || null}
                                            onChange={(name) => update(i, { icon: name || undefined })}
                                            data={ICON_OPTIONS}
                                            leftSection={<TriageIcon name={v.icon} size={16} />}
                                            renderOption={({ option }) => <Group gap={6}><TriageIcon name={option.value} size={16} /><Text size="sm">{option.label}</Text></Group>}
                                            w={130}
                                            data-test="ai-verdict-icon"
                                            comboboxProps={{ withinPortal: true }}
                                            checkIconPosition="right"
                                        />
                                    </Table.Td>
                                    <Table.Td><ColorInput value={v.color} onChange={(c) => update(i, { color: c })} format="hex" w={120} /></Table.Td>
                                    <Table.Td><NumberInput value={v.severity} onChange={(n) => update(i, { severity: typeof n === 'number' ? n : 0 })} w={70} /></Table.Td>
                                    <Table.Td><Checkbox checked={v.autoAcceptable} onChange={(e) => update(i, { autoAcceptable: e.currentTarget.checked })} /></Table.Td>
                                    <Table.Td><Checkbox checked={!!v.neverAutoAccept} onChange={(e) => update(i, { neverAutoAccept: e.currentTarget.checked })} /></Table.Td>
                                    <Table.Td><Checkbox checked={!!v.isFallback} onChange={(e) => update(i, { isFallback: e.currentTarget.checked })} /></Table.Td>
                                    <Table.Td><ActionIcon color="red" variant="subtle" onClick={() => remove(i)} data-test="ai-verdict-delete"><IconTrash size={16} /></ActionIcon></Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                    <Group mt="md">
                        <Button variant="default" leftSection={<IconPlus size={16} />} onClick={add} data-test="ai-verdict-add">Add verdict</Button>
                        <Button onClick={save} loading={saving} data-test="ai-perproject-save">Save project config</Button>
                    </Group>
                </>
            )}
        </Paper>
    );
}

export default function AdminAI() {
    useSubpageEffect('AI');
    const settingsQuery: any = useQuery({ queryKey: ['settings'], queryFn: () => GenericService.get('settings'), enabled: true });

    return (
        <ScrollArea type="auto" h="calc(100vh - 120px)">
            <Box p={10} style={{ minHeight: '100%' }}>
                <Title>AI</Title>
                {settingsQuery.isLoading
                    ? <Loader />
                    : <AIProviderSettingsForm settings={settingsQuery.data || []} refetch={settingsQuery.refetch} />}
                <PerProjectTriage />
            </Box>
        </ScrollArea>
    );
}
