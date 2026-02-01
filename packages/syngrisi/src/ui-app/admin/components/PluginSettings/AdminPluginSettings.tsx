/**
 * Plugin Settings Admin Component
 * Displays plugin configurations with effective values (merged ENV + DB)
 * Compatible with Mantine v5
 */

import * as React from 'react';
import { useState } from 'react';
import {
    Table,
    Badge,
    Switch,
    TextInput,
    Select,
    Button,
    Group,
    Stack,
    Title,
    Text,
    Paper,
    Accordion,
    Code,
    Loader,
    Alert,
    Divider,
} from '@mantine/core';
import { IconPlugConnected, IconAlertCircle, IconCheck, IconX, IconRefresh } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface PluginSettingSchema {
    key: string;
    label: string;
    description?: string;
    type: 'string' | 'number' | 'boolean' | 'select' | 'password';
    defaultValue?: unknown;
    envVariable?: string;
    options?: Array<{ value: string; label: string }>;
    required?: boolean;
}

interface EffectiveConfigValue {
    value: unknown;
    source: 'db' | 'env' | 'default';
}

interface PluginInfo {
    pluginName: string;
    displayName: string;
    description?: string;
    enabled: boolean;
    loaded: boolean;
    version?: string;
    settings: Record<string, unknown>;
    settingsSchema: PluginSettingSchema[];
    effectiveConfig: Record<string, EffectiveConfigValue>;
    updatedAt?: string;
}

interface PluginsResponse {
    plugins: PluginInfo[];
}

const fetchPlugins = async (): Promise<PluginsResponse> => {
    console.log('[PluginSettings] fetchPlugins: Starting request to /v1/plugin-settings');
    try {
        const response = await fetch('/v1/plugin-settings', {
            credentials: 'include', // Required for session-based authentication
        });
        console.log('[PluginSettings] fetchPlugins: Response received', {
            status: response.status,
            statusText: response.statusText,
            redirected: response.redirected,
            url: response.url,
            type: response.type,
        });
        if (!response.ok) {
            console.error('[PluginSettings] fetchPlugins: Response not OK', response.status);
            throw new Error('Failed to fetch plugins');
        }
        const data = await response.json();
        console.log('[PluginSettings] fetchPlugins: Data received', data);
        return data;
    } catch (error) {
        console.error('[PluginSettings] fetchPlugins: Error caught', error);
        throw error;
    }
};

const updatePluginSettings = async ({
    pluginName,
    data,
}: {
    pluginName: string;
    data: Partial<{ enabled: boolean; settings: Record<string, unknown> }>;
}) => {
    const response = await fetch(`/v1/plugin-settings/${pluginName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // Required for session-based authentication
    });
    if (!response.ok) {
        throw new Error('Failed to update plugin settings');
    }
    return response.json();
};

const getSourceBadge = (source: 'db' | 'env' | 'default') => {
    switch (source) {
        case 'db':
            return <Badge color="blue" size="xs">UI</Badge>;
        case 'env':
            return <Badge color="gray" size="xs">ENV</Badge>;
        case 'default':
            return <Badge color="dimmed" size="xs">Default</Badge>;
        default:
            return null;
    }
};

function PluginSettingsForm({
    plugin,
    onUpdate,
}: {
    plugin: PluginInfo;
    onUpdate: (settings: Record<string, unknown>) => void;
}) {
    const [localSettings, setLocalSettings] = useState<Record<string, unknown>>(plugin.settings);

    const handleChange = (key: string, value: unknown) => {
        const newSettings = { ...localSettings, [key]: value };
        setLocalSettings(newSettings);
    };

    const handleSave = () => {
        onUpdate(localSettings);
    };

    const handleClear = (key: string) => {
        const newSettings = { ...localSettings };
        delete newSettings[key];
        setLocalSettings(newSettings);
        onUpdate(newSettings);
    };

    if (plugin.settingsSchema.length === 0) {
        return (
            <Text color="dimmed" size="sm">
                No configurable settings for this plugin.
            </Text>
        );
    }

    return (
        <Stack spacing="md">
            {plugin.settingsSchema.map((field) => {
                const effectiveValue = plugin.effectiveConfig[field.key];
                const dbValue = localSettings[field.key];
                const hasDbValue = dbValue !== undefined;

                return (
                    <Paper key={field.key} p="sm" withBorder>
                        <Group position="apart" mb="xs">
                            <Text weight={500}>{field.label}</Text>
                            {effectiveValue && getSourceBadge(hasDbValue ? 'db' : effectiveValue.source)}
                        </Group>
                        
                        {field.description && (
                            <Text size="xs" color="dimmed" mb="xs">
                                {field.description}
                            </Text>
                        )}

                        <Group align="flex-end">
                            {field.type === 'boolean' && (
                                <Switch
                                    checked={dbValue !== undefined ? Boolean(dbValue) : Boolean(effectiveValue?.value)}
                                    onChange={(e) => handleChange(field.key, e.currentTarget.checked)}
                                    label={dbValue !== undefined ? String(dbValue) : String(effectiveValue?.value ?? 'false')}
                                />
                            )}

                            {field.type === 'string' && (
                                <TextInput
                                    style={{ flex: 1 }}
                                    value={dbValue !== undefined ? String(dbValue) : ''}
                                    placeholder={effectiveValue?.value ? String(effectiveValue.value) : `Enter ${field.label}`}
                                    onChange={(e) => handleChange(field.key, e.currentTarget.value)}
                                />
                            )}

                            {field.type === 'password' && (
                                <TextInput
                                    style={{ flex: 1 }}
                                    type="password"
                                    value={dbValue !== undefined ? String(dbValue) : ''}
                                    placeholder={effectiveValue?.value ? '********' : `Enter ${field.label}`}
                                    onChange={(e) => handleChange(field.key, e.currentTarget.value)}
                                />
                            )}

                            {field.type === 'number' && (
                                <TextInput
                                    style={{ flex: 1 }}
                                    type="number"
                                    value={dbValue !== undefined ? String(dbValue) : ''}
                                    placeholder={effectiveValue?.value !== undefined ? String(effectiveValue.value) : `Enter ${field.label}`}
                                    onChange={(e) => handleChange(field.key, parseFloat(e.currentTarget.value) || 0)}
                                />
                            )}

                            {field.type === 'select' && field.options && (
                                <Select
                                    style={{ flex: 1 }}
                                    value={dbValue !== undefined ? String(dbValue) : String(effectiveValue?.value ?? '')}
                                    data={field.options}
                                    onChange={(value) => handleChange(field.key, value)}
                                />
                            )}

                            {hasDbValue && (
                                <Button
                                    size="xs"
                                    variant="subtle"
                                    color="red"
                                    onClick={() => handleClear(field.key)}
                                    title="Clear UI override, use ENV/default"
                                >
                                    <IconX size={14} />
                                </Button>
                            )}
                        </Group>

                        {field.envVariable && (
                            <Text size="xs" color="dimmed" mt="xs">
                                ENV: <Code>{field.envVariable}</Code>
                            </Text>
                        )}
                    </Paper>
                );
            })}

            <Button onClick={handleSave} leftIcon={<IconCheck size={16} />}>
                Save Settings
            </Button>
        </Stack>
    );
}

function EffectiveConfigView({ plugin }: { plugin: PluginInfo }) {
    const entries = Object.entries(plugin.effectiveConfig);
    
    if (entries.length === 0) {
        return <Text color="dimmed" size="sm">No configuration values.</Text>;
    }

    return (
        <Table striped highlightOnHover withBorder>
            <thead>
                <tr>
                    <th>Setting</th>
                    <th>Value</th>
                    <th>Source</th>
                </tr>
            </thead>
            <tbody>
                {entries.map(([key, { value, source }]) => (
                    <tr key={key}>
                        <td><Code>{key}</Code></td>
                        <td>
                            <Text size="sm" style={{ fontFamily: 'monospace' }}>
                                {typeof value === 'string' && value.length > 50 
                                    ? `${value.substring(0, 47)}...` 
                                    : String(value ?? 'null')}
                            </Text>
                        </td>
                        <td>{getSourceBadge(source)}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default function AdminPluginSettings() {
    const queryClient = useQueryClient();
    
    const { data, isLoading, error, refetch } = useQuery<PluginsResponse>({
        queryKey: ['plugin-settings'],
        queryFn: fetchPlugins,
    });

    const mutation = useMutation({
        mutationFn: updatePluginSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plugin-settings'] });
            showNotification({
                title: 'Settings Updated',
                message: 'Plugin settings have been saved. A server restart may be required.',
                color: 'green',
                icon: <IconCheck size={16} />,
            });
        },
        onError: (err) => {
            showNotification({
                title: 'Error',
                message: err instanceof Error ? err.message : 'Failed to update settings',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        },
    });

    const handleToggle = (pluginName: string, enabled: boolean) => {
        mutation.mutate({ pluginName, data: { enabled } });
    };

    const handleUpdateSettings = (pluginName: string, settings: Record<string, unknown>) => {
        mutation.mutate({ pluginName, data: { settings } });
    };

    if (isLoading) {
        return (
            <Stack align="center" p="xl">
                <Loader />
                <Text>Loading plugin settings...</Text>
            </Stack>
        );
    }

    if (error) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                Failed to load plugin settings. Make sure you have admin permissions.
            </Alert>
        );
    }

    const plugins = data?.plugins || [];

    return (
        <Stack spacing="lg" p="md">
            <Group position="apart">
                <Group>
                    <IconPlugConnected size={24} />
                    <Title order={3}>Plugin Settings</Title>
                </Group>
                <Button
                    variant="subtle"
                    leftIcon={<IconRefresh size={16} />}
                    onClick={() => refetch()}
                >
                    Refresh
                </Button>
            </Group>

            <Text color="dimmed" size="sm">
                Configure plugins here. UI settings have priority over environment variables.
                Changes may require a server restart to take effect.
            </Text>

            <Divider />

            {plugins.length === 0 ? (
                <Alert color="gray">
                    No plugins registered. Plugins will appear here after they are loaded.
                </Alert>
            ) : (
                <Accordion variant="separated">
                    {plugins.map((plugin) => (
                        <Accordion.Item key={plugin.pluginName} value={plugin.pluginName} data-value={plugin.pluginName}>
                            <Accordion.Control>
                                <Group position="apart" noWrap>
                                    <Group>
                                        <Text weight={500}>{plugin.displayName}</Text>
                                        {plugin.version && (
                                            <Badge variant="outline" size="sm">
                                                v{plugin.version}
                                            </Badge>
                                        )}
                                        {plugin.loaded ? (
                                            <Badge color="green" size="sm">Loaded</Badge>
                                        ) : (
                                            <Badge color="gray" size="sm">Not Loaded</Badge>
                                        )}
                                    </Group>
                                    <Switch
                                        checked={plugin.enabled}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleToggle(plugin.pluginName, e.currentTarget.checked);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        label={plugin.enabled ? 'Enabled' : 'Disabled'}
                                    />
                                </Group>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack spacing="md">
                                    {plugin.description && (
                                        <Text size="sm" color="dimmed">{plugin.description}</Text>
                                    )}

                                    <Title order={5}>Configuration</Title>
                                    <PluginSettingsForm
                                        plugin={plugin}
                                        onUpdate={(settings) => handleUpdateSettings(plugin.pluginName, settings)}
                                    />

                                    <Divider my="sm" />

                                    <Title order={5}>Effective Configuration</Title>
                                    <Text size="xs" color="dimmed">
                                        These are the actual values being used by the plugin (merged from UI and ENV).
                                    </Text>
                                    <EffectiveConfigView plugin={plugin} />
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
        </Stack>
    );
}
