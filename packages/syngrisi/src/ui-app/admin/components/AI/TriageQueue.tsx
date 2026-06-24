/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useState } from 'react';
import {
    Paper, Title, Group, Switch, Badge, Accordion, Text, Button, ActionIcon, Loader, Stack, Tooltip,
} from '@mantine/core';
import { IconRefresh, IconBan, IconReload } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TriageService } from '@shared/services';
import { TriageVerdict } from '@shared/components/Check/TriageVerdict';
import { HelpDoc } from '@admin/components/AI/HelpDoc';
import { errorMsg } from '@shared/utils';

type QueueCheck = { id: string; name: string; status: string; triage: any };
type QueueRun = { run: { id: string; name: string; createdDate?: string }; checks: QueueCheck[] };

// Admin AI → Queue tab: failed-with-diff checks in triage-enabled projects, grouped by run,
// with manual restart / cancel. Auto-refreshes so in-progress items update live.
export function TriageQueue() {
    const qc = useQueryClient();
    const [pendingOnly, setPendingOnly] = useState(false);
    const [busy, setBusy] = useState(false);

    const queueQuery = useQuery({
        queryKey: ['triage-queue', pendingOnly],
        queryFn: () => TriageService.getQueue(pendingOnly),
        refetchInterval: 4000, // live status while analysis runs
        refetchOnWindowFocus: true,
    });

    const runs: QueueRun[] = queueQuery.data?.runs || [];
    const counts = queueQuery.data?.counts || { pending: 0, done: 0, cancelled: 0, failed: 0 };

    const act = async (fn: () => Promise<void>) => {
        setBusy(true);
        try {
            await fn();
            await queueQuery.refetch();
            qc.invalidateQueries({ queryKey: ['preview_checks'] }); // refresh verdicts on the main grid
        } catch (e) {
            errorMsg({ error: e });
        } finally {
            setBusy(false);
        }
    };

    return (
        <Paper withBorder p={20} m={15} style={{ width: '90%' }} data-test="ai-queue">
            <Group justify="space-between" mb="md">
                <Group gap={6}>
                    <Title order={4}>Triage queue</Title>
                    <HelpDoc
                        title="Triage queue"
                        lines={[
                            'Failed checks (with a diff) in triage-enabled projects, grouped by run. Analysis runs in the background; this view refreshes automatically.',
                            'Restart re-runs the model on a check; Cancel stops it and marks the verdict as "cancelled". Both are available per check and per run.',
                            '"Only in queue" shows just the checks still awaiting analysis.',
                        ]}
                    />
                </Group>
                <Group gap="sm">
                    <Badge color="blue" variant="light" data-test="ai-queue-count-pending">{counts.pending} pending</Badge>
                    <Badge color="green" variant="light">{counts.done} done</Badge>
                    <Badge color="gray" variant="light">{counts.cancelled} cancelled</Badge>
                    <Switch
                        label="Only in queue"
                        checked={pendingOnly}
                        onChange={(e) => setPendingOnly(e.currentTarget.checked)}
                        data-test="ai-queue-pending-toggle"
                    />
                    <Tooltip label="Refresh">
                        <ActionIcon variant="subtle" onClick={() => queueQuery.refetch()} data-test="ai-queue-refresh"><IconReload size={18} /></ActionIcon>
                    </Tooltip>
                </Group>
            </Group>

            {queueQuery.isLoading ? <Loader /> : runs.length === 0 ? (
                <Text size="sm" c="dimmed">The queue is empty — no failed checks in triage-enabled projects.</Text>
            ) : (
                <Accordion multiple variant="separated">
                    {runs.map((r) => {
                        const ids = r.checks.map((c) => c.id);
                        return (
                            <Accordion.Item key={r.run.id} value={r.run.id} data-test="ai-queue-run" data-run-name={r.run.name}>
                                <Accordion.Control>
                                    <Group justify="space-between" pr="sm">
                                        <Text fw={500}>{r.run.name}</Text>
                                        <Badge variant="light" color="gray">{r.checks.length} checks</Badge>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Group mb="sm" gap="xs">
                                        <Button size="compact-xs" variant="light" leftSection={<IconRefresh size={14} />} loading={busy}
                                            onClick={() => act(() => TriageService.restartMany(ids))} data-test="ai-queue-run-restart">Restart all</Button>
                                        <Button size="compact-xs" variant="light" color="gray" leftSection={<IconBan size={14} />} loading={busy}
                                            onClick={() => act(() => TriageService.cancelMany(ids))} data-test="ai-queue-run-cancel">Cancel all</Button>
                                    </Group>
                                    <Stack gap={6}>
                                        {r.checks.map((c) => (
                                            <Group key={c.id} justify="space-between" data-test="ai-queue-check" data-check-name={c.name} wrap="nowrap">
                                                <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
                                                    <Text size="sm" truncate>{c.name}</Text>
                                                    {c.triage?.pending
                                                        ? <Badge color="blue" variant="light" leftSection={<Loader size={10} color="blue" />} data-test="ai-queue-pending">analyzing…</Badge>
                                                        : (c.triage?.verdict ? <TriageVerdict check={{ triage: c.triage }} /> : <Badge variant="light" color="gray">no verdict</Badge>)}
                                                </Group>
                                                <Group gap={4} wrap="nowrap">
                                                    <Tooltip label="Restart analysis">
                                                        <ActionIcon variant="subtle" color="blue" loading={busy} onClick={() => act(() => TriageService.restartMany([c.id]))} data-test="ai-queue-restart"><IconRefresh size={16} /></ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="Cancel analysis">
                                                        <ActionIcon variant="subtle" color="gray" loading={busy} onClick={() => act(() => TriageService.cancelMany([c.id]))} data-test="ai-queue-cancel"><IconBan size={16} /></ActionIcon>
                                                    </Tooltip>
                                                </Group>
                                            </Group>
                                        ))}
                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                        );
                    })}
                </Accordion>
            )}
        </Paper>
    );
}
