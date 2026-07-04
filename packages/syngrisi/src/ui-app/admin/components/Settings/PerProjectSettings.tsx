import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
    Paper, Select, Switch, TextInput, Button, Group, Text, Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { GenericService } from '@shared/services';
import { http } from '@shared/lib/http';
import config from '@config';
import { errorMsg, successMsg } from '@shared/utils/utils';

export function PerProjectSettings() {
    const appsQuery = useQuery({ queryKey: ['apps-for-settings'], queryFn: () => GenericService.get('app', {}, { limit: '0' }) });
    const apps: any[] = appsQuery.data?.results || [];
    const [appId, setAppId] = useState<string | null>(null);
    const selected = useMemo(() => apps.find((a) => a._id === appId), [apps, appId]);

    const [branchFallbackEnabled, setBranchFallbackEnabled] = useState(false);
    const [mainBranch, setMainBranch] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!selected) return;
        setBranchFallbackEnabled(selected.branchFallbackEnabled === true);
        setMainBranch(typeof selected.mainBranch === 'string' ? selected.mainBranch : '');
    }, [selected]);

    const save = async () => {
        if (!appId) return;
        setSaving(true);
        try {
            const resp = await http.patch(`${config.baseUri}/v1/app/${appId}/triage-policy`, {
                mainBranch: mainBranch.trim(),
                branchFallbackEnabled,
            }, {}, 'PerProjectSettings.save');
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            successMsg({ message: 'Project settings saved' });
            appsQuery.refetch();
        } catch (e) {
            errorMsg({ error: e });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Paper withBorder p={20} m={15} style={{ width: '90%' }} data-test="project-settings-form">
            <Title order={4} mb="md">Project settings</Title>
            <Select
                label="Project"
                placeholder={appsQuery.isLoading ? 'loading…' : 'select a project'}
                value={appId}
                onChange={setAppId}
                data-test="project-settings-select"
                data={apps.map((a) => ({ value: a._id, label: a.name }))}
                mb="md"
            />
            {!appId ? <Text size="sm" c="dimmed">Select a project to configure its settings.</Text> : (
                <>
                    <Switch
                        label="Enable branch baseline fallback"
                        description="When a check on another branch has no accepted baseline of its own, fall back to the main branch's accepted baseline instead of landing as new/not accepted."
                        checked={branchFallbackEnabled}
                        onChange={(e) => setBranchFallbackEnabled(e.currentTarget.checked)}
                        data-test="settings-branch-fallback-enabled"
                        mb="md"
                        styles={{ description: { maxWidth: 420 } }}
                    />
                    <TextInput
                        label="Main branch"
                        description="Branch whose accepted baselines are used as a fallback for every other branch"
                        placeholder="e.g. main"
                        value={mainBranch}
                        onChange={(e) => setMainBranch(e.currentTarget.value)}
                        data-test="settings-main-branch"
                        disabled={!branchFallbackEnabled}
                        w={260}
                        mb="md"
                    />
                    <Group mt="md">
                        <Button onClick={save} loading={saving} data-test="project-settings-save">Save</Button>
                    </Group>
                </>
            )}
        </Paper>
    );
}
