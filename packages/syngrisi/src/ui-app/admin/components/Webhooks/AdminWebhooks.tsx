/**
 * Webhooks Admin Component
 * Manage webhook registrations: URL, subscribed events, enabled flag and secret.
 * `secret` is write-only: it can be set on create/update but the API never returns it.
 */

import * as React from 'react';
import { useState } from 'react';
import {
    Table,
    Badge,
    Switch,
    TextInput,
    PasswordInput,
    MultiSelect,
    Button,
    Group,
    Stack,
    Text,
    Modal,
    ActionIcon,
    Loader,
    Alert,
} from '@mantine/core';
import { IconWebhook, IconAlertCircle, IconPlus, IconTrash, IconPencil, IconRefresh } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WebhooksService, IWebhook, IWebhookInput, WebhookEvent } from '@shared/services';
import { AdminPageHeader } from '@admin/components/common/AdminPageHeader';

const EVENT_OPTIONS: { value: WebhookEvent; label: string }[] = [
    { value: 'check.created', label: 'check.created' },
    { value: 'check.updated', label: 'check.updated' },
    { value: 'test.finished', label: 'test.finished' },
    { value: 'run.finished', label: 'run.finished' },
];

const emptyForm: IWebhookInput = {
    url: '',
    events: ['check.created', 'check.updated'],
    secret: '',
    enabled: true,
};

function WebhookForm({
    initial,
    onSubmit,
    onCancel,
    submitting,
}: {
    initial: IWebhookInput;
    onSubmit: (data: IWebhookInput) => void;
    onCancel: () => void;
    submitting: boolean;
}) {
    const [form, setForm] = useState<IWebhookInput>(initial);

    return (
        <Stack gap="md">
            <TextInput
                label="URL"
                placeholder="https://example.com/hooks/syngrisi"
                required
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.currentTarget.value })}
            />
            <MultiSelect
                label="Events"
                data={EVENT_OPTIONS}
                value={form.events}
                onChange={(value) => setForm({ ...form, events: value as WebhookEvent[] })}
            />
            <PasswordInput
                label="Secret"
                description="Write-only. Leave blank to keep the existing secret (or unset if creating new)."
                placeholder="Shared secret sent via X-Syngrisi-Secret header"
                value={form.secret}
                onChange={(e) => setForm({ ...form, secret: e.currentTarget.value })}
            />
            <Switch
                label="Enabled"
                checked={Boolean(form.enabled)}
                onChange={(e) => setForm({ ...form, enabled: e.currentTarget.checked })}
            />
            <Group justify="flex-end">
                <Button variant="subtle" onClick={onCancel}>Cancel</Button>
                <Button
                    onClick={() => onSubmit(form)}
                    disabled={!form.url || submitting}
                    loading={submitting}
                >
                    Save
                </Button>
            </Group>
        </Stack>
    );
}

export default function AdminWebhooks() {
    const queryClient = useQueryClient();
    const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
    const [editingWebhook, setEditingWebhook] = useState<IWebhook | null>(null);
    const [deletingWebhook, setDeletingWebhook] = useState<IWebhook | null>(null);

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['webhooks'],
        queryFn: () => WebhooksService.list(),
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['webhooks'] });

    const createMutation = useMutation({
        mutationFn: (input: IWebhookInput) => WebhooksService.create(input),
        onSuccess: () => {
            invalidate();
            setModalMode(null);
            showNotification({ title: 'Webhook created', message: 'The webhook was registered.', color: 'green' });
        },
        onError: (err) => {
            showNotification({
                title: 'Error',
                message: err instanceof Error ? err.message : 'Failed to create webhook',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<IWebhookInput> }) => WebhooksService.update(id, data),
        onSuccess: () => {
            invalidate();
            setModalMode(null);
            setEditingWebhook(null);
            showNotification({ title: 'Webhook updated', message: 'The webhook was updated.', color: 'green' });
        },
        onError: (err) => {
            showNotification({
                title: 'Error',
                message: err instanceof Error ? err.message : 'Failed to update webhook',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        },
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => WebhooksService.remove(id),
        onSuccess: () => {
            invalidate();
            setDeletingWebhook(null);
            showNotification({ title: 'Webhook deleted', message: 'The webhook was removed.', color: 'green' });
        },
        onError: (err) => {
            showNotification({
                title: 'Error',
                message: err instanceof Error ? err.message : 'Failed to delete webhook',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        },
    });

    const handleToggleEnabled = (webhook: IWebhook, enabled: boolean) => {
        updateMutation.mutate({ id: webhook.id, data: { enabled } });
    };

    if (isLoading) {
        return (
            <Stack align="center" p="xl">
                <Loader />
                <Text>Loading webhooks...</Text>
            </Stack>
        );
    }

    if (error) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                Failed to load webhooks. Make sure you have admin permissions.
            </Alert>
        );
    }

    const webhooks = data?.results || [];

    return (
        <Stack gap="lg" p="md">
            <AdminPageHeader
                icon={<IconWebhook size={24} />}
                title="Webhooks"
                description="Webhooks receive a JSON payload ({ event, payload, timestamp }) via POST whenever a subscribed event fires, signed with the X-Syngrisi-Secret header."
                actions={(
                    <>
                        <ActionIcon
                            title="reload webhooks"
                            variant="subtle"
                            onClick={() => refetch()}
                            loading={isFetching}
                        >
                            <IconRefresh stroke={1} size={20} />
                        </ActionIcon>
                        <Button
                            leftSection={<IconPlus size={16} />}
                            onClick={() => setModalMode('create')}
                        >
                            Add Webhook
                        </Button>
                    </>
                )}
            />

            {webhooks.length === 0 ? (
                <Alert color="gray">No webhooks registered yet.</Alert>
            ) : (
                <Table striped highlightOnHover withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>URL</Table.Th>
                            <Table.Th>Events</Table.Th>
                            <Table.Th>Enabled</Table.Th>
                            <Table.Th>Created</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {webhooks.map((webhook) => (
                            <Table.Tr key={webhook.id}>
                                <Table.Td>
                                    <Text size="sm" style={{ wordBreak: 'break-all' }}>{webhook.url}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap={4}>
                                        {webhook.events.map((event) => (
                                            <Badge key={event} variant="outline" size="sm">{event}</Badge>
                                        ))}
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Switch
                                        checked={webhook.enabled}
                                        onChange={(e) => handleToggleEnabled(webhook, e.currentTarget.checked)}
                                    />
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" c="dimmed">
                                        {webhook.createdDate ? new Date(webhook.createdDate).toLocaleString() : ''}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <ActionIcon
                                            variant="subtle"
                                            title="Edit webhook"
                                            onClick={() => {
                                                setEditingWebhook(webhook);
                                                setModalMode('edit');
                                            }}
                                        >
                                            <IconPencil size={16} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            title="Delete webhook"
                                            onClick={() => setDeletingWebhook(webhook)}
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            )}

            <Modal
                opened={modalMode !== null}
                onClose={() => {
                    setModalMode(null);
                    setEditingWebhook(null);
                }}
                title={modalMode === 'edit' ? 'Edit Webhook' : 'Add Webhook'}
            >
                <WebhookForm
                    initial={modalMode === 'edit' && editingWebhook
                        ? { url: editingWebhook.url, events: editingWebhook.events, secret: '', enabled: editingWebhook.enabled }
                        : emptyForm}
                    submitting={createMutation.isPending || updateMutation.isPending}
                    onCancel={() => {
                        setModalMode(null);
                        setEditingWebhook(null);
                    }}
                    onSubmit={(formData) => {
                        // Don't send an empty secret on update - that would be
                        // indistinguishable from "clear the secret" vs "leave it".
                        const payload = { ...formData };
                        if (modalMode === 'edit' && !payload.secret) {
                            delete payload.secret;
                        }
                        if (modalMode === 'edit' && editingWebhook) {
                            updateMutation.mutate({ id: editingWebhook.id, data: payload });
                        } else {
                            createMutation.mutate(payload);
                        }
                    }}
                />
            </Modal>

            <Modal
                opened={deletingWebhook !== null}
                onClose={() => setDeletingWebhook(null)}
                title="Delete Webhook"
            >
                <Stack gap="md">
                    <Text>
                        Are you sure you want to delete the webhook for
                        {' '}
                        <b>{deletingWebhook?.url}</b>
                        ?
                    </Text>
                    <Group justify="flex-end">
                        <Button variant="subtle" onClick={() => setDeletingWebhook(null)}>Cancel</Button>
                        <Button
                            color="red"
                            loading={removeMutation.isPending}
                            onClick={() => deletingWebhook && removeMutation.mutate(deletingWebhook.id)}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Stack>
    );
}
