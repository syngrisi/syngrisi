/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
    ScrollArea, Box, Title, Paper, Select, Switch, NumberInput, MultiSelect, Button, Group, Table,
    TextInput, Checkbox, ActionIcon, Text, Divider, ColorInput, Loader, Badge, Textarea, FileButton, Image, Stack,
} from '@mantine/core';
import { IconTrash, IconPlus, IconPhoto } from '@tabler/icons-react';
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
    { key: 'noise', label: 'Noise', color: 'gray', icon: 'wave', severity: 1, autoAcceptable: true, description: 'pixels differ but the UI is effectively unchanged — sub-pixel/anti-aliasing shifts or dynamic content (dates, counters, spinners, random data)' },
    { key: 'intended_change', label: 'Intended change', color: 'green', icon: 'check', severity: 2, autoAcceptable: true, description: 'a coherent, complete change — content cleanly added, removed, reworded, restyled or moved with no layout breakage (expect a new baseline)' },
    { key: 'uncertain', label: 'Uncertain', color: 'yellow', icon: 'question', severity: 3, autoAcceptable: false, neverAutoAccept: true, isFallback: true, description: 'evidence is weak, conflicting or ambiguous — not confident enough to classify' },
    { key: 'likely_bug', label: 'Likely bug', color: 'red', icon: 'bug', severity: 4, autoAcceptable: false, neverAutoAccept: true, description: 'a visual defect — broken/collapsed layout, overlap, clipping, misalignment, missing content leaving a gap, unreadable contrast or cut-off text' },
];

const ICON_OPTIONS = TRIAGE_ICON_NAMES.map((n) => ({ value: n, label: n }));

type Example = { verdict: string; image: string; note?: string };

// Mirror of the server's buildSystemPrompt() — used by "Reset to default" so the user can edit
// the exact default prompt for the current verdict set. Keep in sync with server/services/triage/prompt.ts.
function buildDefaultPrompt(verdicts: Verdict[]): string {
    const fb = verdicts.find((v) => v.isFallback) || verdicts[0];
    const lines = verdicts.map((v) => `- ${v.key}: ${v.description || v.label}`).join('\n');
    const keys = verdicts.map((v) => v.key).join(' | ');
    return `You are a visual-regression triage assistant. You are given a baseline screenshot, the actual screenshot, and a highlighted diff image of a UI. Classify what changed.

Context for this check: name "{{checkName}}", test "{{testName}}", suite "{{suiteName}}", project "{{appName}}", viewport {{viewport}}, browser {{browserName}}, OS {{os}}, pixel difference vs baseline {{diffPercent}}%.

Return STRICT JSON only, no prose, with this exact shape:
{"verdict": "<one of: ${keys}>", "confidence": <integer 0..10>, "reason": "<one short phrase>"}

Verdict meaning (choose the single best match):
${lines}

How to decide:
- Judge ONLY by what is visible. You cannot know the developer's intent — infer it from visual evidence; do NOT assume a change is intentional just because it looks deliberate.
- Inspect: what appeared or disappeared, layout and alignment, overlap or clipping, spacing, colors and contrast, text content, and whether the new state looks coherent and complete or broken and incomplete.
- Signs of a real defect (a regression / bug): overlapping or clipped elements, collapsed or broken layout, misalignment, content missing and leaving an empty or broken gap, a broken or failed-to-load image (empty image frame, broken-image placeholder, or alt text shown instead of the picture), unreadable contrast, cut-off text, duplicated or stray elements.
- Signs of an intended change: the new state looks coherent, aligned and complete — content cleanly added, removed, reworded, restyled or moved, with no layout breakage.
- Signs of noise: sub-pixel or anti-aliasing differences, dynamic content (dates, times, counters, spinners, random data) or rendering jitter — pixels differ but the UI is effectively the same.
- When evidence is weak, conflicting, or you genuinely cannot tell, prefer "${fb?.key}" instead of guessing.

How to score confidence (integer 0..10):
- 9-10: a large, unambiguous change that clearly fits one verdict.
- 6-8: a clear change; the verdict is likely but with some room for doubt.
- 3-5: a weak or partial signal; the verdict is mostly a guess.
- 0-2: almost no evidence or fully ambiguous — use "${fb?.key}".

Rules:
- reason is ONE short human-readable phrase describing the visible change (e.g. "header overlaps content", "new banner added", "timestamp updated").
- Never invent a verdict outside the allowed set; output JSON only.`;
}

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
    const [prompt, setPrompt] = useState<string>('');
    const [examples, setExamples] = useState<Example[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!selected) return;
        setEnabled(selected.triageEnabled === true);
        setMode(selected.triagePolicy?.policy || 'suggest');
        setThreshold(typeof selected.triagePolicy?.autoAcceptThreshold === 'number' ? selected.triagePolicy.autoAcceptThreshold : 9);
        setAllow(selected.triagePolicy?.autoAcceptVerdicts || ['intended_change', 'noise']);
        const vlist = Array.isArray(selected.triageVerdicts) && selected.triageVerdicts.length ? selected.triageVerdicts : DEFAULT_VERDICTS;
        setVerdicts(vlist);
        // Always show the effective prompt: the project's override, or the generated default.
        setPrompt(selected.triagePrompt ? selected.triagePrompt : buildDefaultPrompt(vlist));
        setExamples(Array.isArray(selected.triageExamples) ? selected.triageExamples : []);
    }, [selected]);

    const addExample = (file: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setExamples((ex) => [...ex, { verdict: verdicts[0]?.key || '', image: String(reader.result), note: '' }]);
        reader.readAsDataURL(file); // stored as a data URL (data:image/...;base64,...)
    };
    const updateExample = (i: number, patch: Partial<Example>) => setExamples((ex) => ex.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
    const removeExample = (i: number) => setExamples((ex) => ex.filter((_, idx) => idx !== i));

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
                // if the prompt still equals the generated default, store empty (= keep following the default)
                triagePrompt: prompt.trim() === buildDefaultPrompt(verdicts).trim() ? '' : prompt.trim(),
                triageExamples: examples,
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
                        <NumberInput label="Confidence threshold" description="below it the verdict shows as Unknown" min={0} max={10} value={threshold} onChange={(v) => setThreshold(typeof v === 'number' ? v : 9)} data-test="ai-policy-threshold" w={220} />
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
                    </Group>

                    <Divider my="md" label={(
                        <Group gap={4}>
                            <Text size="sm">Prompt &amp; few-shot examples</Text>
                            <HelpDoc
                                title="Custom prompt & examples"
                                lines={[
                                    'System prompt: leave empty to use the default (built from the verdicts above). Override it to fully control the model instructions.',
                                    'Few-shot examples: attach reference screenshots and the verdict each should map to — the model sees them before the actual check to anchor its judgement.',
                                ]}
                            />
                        </Group>
                    )}
                    />
                    <Group gap={6} mb={4} align="center">
                        <Text size="sm" fw={500}>System prompt (override)</Text>
                        <HelpDoc
                            dataTest="help-doc-prompt"
                            title="Writing the prompt"
                            lines={[
                                'The box always shows the effective prompt — the default if you have not customized it. Edit freely; “Reset to default” restores it. If you leave it equal to the default, the project keeps following the default.',
                                'Keep the model instructed to return STRICT JSON {"verdict","confidence","reason"} and to only use your verdict keys — otherwise results fall back to the fallback verdict.',
                                'Placeholders are replaced with this check\'s real values at triage time: {{checkName}}, {{testName}}, {{suiteName}}, {{appName}}, {{viewport}}, {{browserName}}, {{browserVersion}}, {{os}}, {{branch}}, {{diffPercent}}, {{failReasons}}, {{status}}, {{imageFormat}}, {{verdicts}}, {{createdDate}}.',
                            ]}
                        />
                        <Button size="compact-xs" variant="default" onClick={() => setPrompt(buildDefaultPrompt(verdicts))} data-test="ai-prompt-reset">Reset to default</Button>
                    </Group>
                    <Textarea
                        placeholder="Leave empty to use the default prompt — “Reset to default” fills it in for editing"
                        value={prompt}
                        onChange={(e) => setPrompt(e.currentTarget.value)}
                        autosize
                        minRows={4}
                        maxRows={18}
                        data-test="ai-prompt"
                        mb="md"
                    />

                    <Text size="sm" fw={500} mb={4}>Few-shot examples</Text>
                    <Stack gap="xs" data-test="ai-examples">
                        {examples.map((ex, i) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Group key={i} gap="xs" align="center" data-test="ai-example-row">
                                <Image src={ex.image} w={64} h={40} fit="contain" radius="sm" />
                                <Select
                                    value={ex.verdict}
                                    onChange={(v) => updateExample(i, { verdict: v || '' })}
                                    data={verdicts.map((v) => ({ value: v.key, label: v.label || v.key }))}
                                    w={170}
                                    comboboxProps={{ withinPortal: true }}
                                    data-test="ai-example-verdict"
                                />
                                <TextInput placeholder="note (optional)" value={ex.note || ''} onChange={(e) => updateExample(i, { note: e.currentTarget.value })} style={{ flex: 1 }} />
                                <ActionIcon color="red" variant="subtle" onClick={() => removeExample(i)} data-test="ai-example-delete"><IconTrash size={16} /></ActionIcon>
                            </Group>
                        ))}
                    </Stack>
                    <FileButton onChange={addExample} accept="image/png,image/jpeg">
                        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                        {(props) => <Button {...props} variant="default" leftSection={<IconPhoto size={16} />} mt="xs" data-test="ai-example-add">Add example image</Button>}
                    </FileButton>

                    <Group mt="md">
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
                <Group gap="sm" align="center">
                    <Title>AI</Title>
                    <Badge color="grape" variant="light" data-test="ai-beta-badge">Beta</Badge>
                </Group>
                {settingsQuery.isLoading
                    ? <Loader />
                    : <AIProviderSettingsForm settings={settingsQuery.data || []} refetch={settingsQuery.refetch} />}
                <PerProjectTriage />
            </Box>
        </ScrollArea>
    );
}
