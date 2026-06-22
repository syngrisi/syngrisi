import React, { useState, useEffect } from 'react';
import { Paper, Title, Select, TextInput, PasswordInput, NumberInput, Button, Switch, Text, Badge, Group } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { GenericService, TriageService } from '@shared/services';
import { errorMsg } from '@shared/utils';
import { successMsg } from '@shared/utils/utils';

type ProviderValue = {
    type?: string;
    baseUrl?: string;
    apiKey?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
};

// Admin form for the AI Triage feature: global enable + model provider config + connection test.
export const AIProviderSettingsForm = ({ settings, refetch }: { settings: any[], refetch: () => void }) => {
    const enabledSetting = settings.find((s) => s.name === 'ai_triage_enabled');
    const providerSetting = settings.find((s) => s.name === 'ai_triage_provider');
    const provider: ProviderValue = (providerSetting?.value && typeof providerSetting.value === 'object') ? providerSetting.value : {};

    const [enabled, setEnabled] = useState<boolean>(String(enabledSetting?.value) === 'true');
    const [type, setType] = useState<string>(provider.type || 'openai');
    const [baseUrl, setBaseUrl] = useState<string>(provider.baseUrl || '');
    const [apiKey, setApiKey] = useState<string>(provider.apiKey || ''); // '***' when configured
    const [model, setModel] = useState<string>(provider.model || '');
    const [testResult, setTestResult] = useState<{ ok: boolean; latencyMs: number; error?: string } | null>(null);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        setEnabled(String(enabledSetting?.value) === 'true');
        setType(provider.type || 'openai');
        setBaseUrl(provider.baseUrl || '');
        setApiKey(provider.apiKey || '');
        setModel(provider.model || '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    const updateSetting = useMutation({
        mutationFn: (data: { name: string, value: any, enabled?: boolean }) => GenericService.update('settings', data),
        onError: (e: any) => errorMsg({ error: e }),
    });

    const providerValue = (): ProviderValue => ({ type, baseUrl, apiKey, model });

    const handleSave = async () => {
        try {
            await updateSetting.mutateAsync({ name: 'ai_triage_provider', value: providerValue() });
            await updateSetting.mutateAsync({ name: 'ai_triage_enabled', value: String(enabled), enabled: true });
            successMsg({ message: 'AI Triage settings saved' });
            refetch();
        } catch (e) {
            errorMsg({ error: e });
        }
    };

    const handleTest = async () => {
        setTesting(true);
        setTestResult(null);
        try {
            const res = await TriageService.testProvider(providerValue() as Record<string, unknown>);
            setTestResult(res);
        } catch (e: any) {
            setTestResult({ ok: false, latencyMs: 0, error: e?.message || String(e) });
        } finally {
            setTesting(false);
        }
    };

    return (
        <Paper withBorder p={20} m={15} style={{ width: '90%' }} data-test="ai-providers-form">
            <Group justify="space-between" mb="md">
                <Title order={4}>AI Triage</Title>
                <Switch
                    label="Enabled"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.currentTarget.checked)}
                    data-test="ai-triage-enabled-switch"
                />
            </Group>
            <Select
                label="Provider"
                value={type}
                onChange={(v) => setType(v || 'openai')}
                data-test="ai-provider-type"
                mb="sm"
                data={[
                    { value: 'openai', label: 'OpenAI / OpenAI-compatible (self-hosted)' },
                    { value: 'anthropic', label: 'Anthropic' },
                    { value: 'gemini', label: 'Google Gemini' },
                ]}
            />
            <TextInput
                label="Base URL (for OpenAI-compatible / self-hosted)"
                placeholder="http://localhost:11434/v1"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.currentTarget.value)}
                mb="sm"
            />
            <PasswordInput
                label="API Key"
                placeholder={apiKey === '***' ? 'configured (leave to keep)' : 'API key'}
                value={apiKey}
                onChange={(e) => setApiKey(e.currentTarget.value)}
                mb="sm"
            />
            <TextInput
                label="Model"
                placeholder="gpt-4o / claude-sonnet-4-6 / gemini-2.0-flash / qwen3-vl:8b"
                value={model}
                onChange={(e) => setModel(e.currentTarget.value)}
                mb="md"
            />
            <Group>
                <Button onClick={handleSave} loading={updateSetting.isPending} data-test="ai-providers-save">Save Settings</Button>
                <Button variant="default" onClick={handleTest} loading={testing} data-test="ai-providers-test">Test connection</Button>
                {testResult && (
                    <Badge color={testResult.ok ? 'green' : 'red'} data-test="ai-providers-test-result">
                        {testResult.ok ? `OK ${testResult.latencyMs}ms` : `Failed: ${testResult.error || ''}`}
                    </Badge>
                )}
            </Group>
            {!enabled && <Text size="xs" c="dimmed" mt="xs">Triage is disabled; failed checks will not be classified.</Text>}
        </Paper>
    );
};
