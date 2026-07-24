/**
 * Admin: CORS & Embed — credentialed cross-origin Accept (e.g. from Jenkins Allure).
 */

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Group,
    Loader,
    MultiSelect,
    Select,
    Stack,
    Switch,
    Textarea,
    Text,
} from '@mantine/core';
import { IconAlertCircle, IconWorldWww } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    CorsEmbedAcceptStatus,
    CorsEmbedRole,
    CorsEmbedService,
    CorsEmbedSettings,
    CorsEmbedSameSite,
} from '@shared/services/corsEmbed.service';
import { AdminPageHeader } from '@admin/components/common/AdminPageHeader';
import { errorMsg, successMsg } from '@shared/utils/utils';

const ROLE_OPTIONS: { value: CorsEmbedRole; label: string }[] = [
    { value: 'admin', label: 'admin' },
    { value: 'reviewer', label: 'reviewer' },
    { value: 'user', label: 'user' },
];

const STATUS_OPTIONS: { value: CorsEmbedAcceptStatus; label: string }[] = [
    { value: 'new', label: 'new' },
    { value: 'not_accepted', label: 'not_accepted' },
    { value: 'different_images', label: 'different_images' },
    { value: 'wrong_dimensions', label: 'wrong_dimensions' },
];

const DEFAULT_FORM: CorsEmbedSettings = {
    enabled: false,
    allowedOrigins: [],
    allowCredentials: true,
    sameSite: 'lax',
    csrfRequired: true,
    allowedAcceptRoles: ['admin', 'reviewer'],
    allowedAcceptStatuses: ['new', 'not_accepted', 'different_images', 'wrong_dimensions'],
    frameAncestors: [],
};

/**
 * Parses a newline / comma separated list of origins into a string array.
 */
function parseOriginList(raw: string): string[] {
    return raw
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);
}

export default function AdminCorsEmbed() {
    const queryClient = useQueryClient();
    const [form, setForm] = useState<CorsEmbedSettings>(DEFAULT_FORM);
    const [originsText, setOriginsText] = useState('');
    const [frameAncestorsText, setFrameAncestorsText] = useState('');

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ['cors-embed'],
        queryFn: () => CorsEmbedService.get(),
    });

    useEffect(() => {
        if (data) {
            setForm(data);
            setOriginsText(data.allowedOrigins.join('\n'));
            setFrameAncestorsText(data.frameAncestors.join('\n'));
        }
    }, [data]);

    const saveMutation = useMutation({
        mutationFn: (value: CorsEmbedSettings) => CorsEmbedService.update(value),
        onSuccess: (value) => {
            queryClient.setQueryData(['cors-embed'], value);
            setForm(value);
            successMsg({ message: 'CORS & Embed settings updated.' });
        },
        onError: (err) => {
            errorMsg({
                error: err instanceof Error ? err : new Error('Failed to save settings'),
            });
        },
    });

    const prepareMutation = useMutation({
        mutationFn: () => CorsEmbedService.prepareCookie(),
        onSuccess: (result) => {
            successMsg({ message: result.message });
        },
        onError: (err) => {
            errorMsg({
                error: err instanceof Error ? err : new Error('Failed to prepare cookie'),
            });
        },
    });

    if (isLoading) {
        return (
            <Stack align="center" p="xl">
                <Loader />
                <Text>Loading CORS & Embed settings...</Text>
            </Stack>
        );
    }

    if (error) {
        return (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                Failed to load settings. Admin role is required.
            </Alert>
        );
    }

    const sameSiteWarning = form.enabled && form.sameSite === 'none';
    const canSave = !form.enabled || form.allowedOrigins.length > 0;

    return (
        <Stack gap="lg" p="md">
            <AdminPageHeader
                icon={<IconWorldWww size={24} />}
                title="CORS & Embed"
                description="Allow credentialed API calls from trusted origins (e.g. Jenkins Allure) while the reviewer is logged into Syngrisi — without sharing an API key."
            />

            <Alert color="blue" title="How to use">
                <Text size="sm">
                    1) Enable the feature and add exact browser origins (scheme + host + port), e.g.
                    {' '}
                    <code>https://ci.example.com</code>
                    .
                    2) Set SameSite to
                    {' '}
                    <code>none</code>
                    {' '}
                    so the session cookie is sent on cross-site
                    {' '}
                    <code>fetch</code>
                    .
                    3) Open Syngrisi while logged in (or click &quot;Prepare session cookie&quot;) so the cookie is re-issued.
                    4) From the allowlisted origin, call
                    {' '}
                    <code>GET /v1/cors-embed/csrf</code>
                    {' '}
                    with credentials, then mutating APIs with
                    {' '}
                    <code>X-CSRF-Token</code>
                    .
                </Text>
            </Alert>

            {sameSiteWarning ? (
                <Alert color="yellow" title="SameSite=None">
                    Requires HTTPS (Secure cookies). CSRF protection stays required when SameSite is none.
                </Alert>
            ) : null}

            <Stack gap="md" style={{ maxWidth: 720 }}>
                <Switch
                    label="Enabled"
                    description="Master switch for production credentialed CORS"
                    checked={form.enabled}
                    onChange={(e) => setForm({ ...form, enabled: e.currentTarget.checked })}
                    data-test="cors-embed-enabled"
                />

                <Textarea
                    label="Allowed origins"
                    description="One origin per line (scheme + host + port, no path). Example: https://jenkins.example.com"
                    placeholder={'https://ci.example.com\nhttps://ci.example.com:8080'}
                    minRows={3}
                    value={originsText}
                    onChange={(e) => {
                        const next = e.currentTarget.value;
                        setOriginsText(next);
                        setForm({ ...form, allowedOrigins: parseOriginList(next) });
                    }}
                    disabled={!form.enabled}
                    data-test="cors-embed-allowed-origins"
                />

                <Switch
                    label="Allow credentials"
                    description="Send Access-Control-Allow-Credentials: true"
                    checked={form.allowCredentials}
                    onChange={(e) => setForm({ ...form, allowCredentials: e.currentTarget.checked })}
                    disabled={!form.enabled}
                />

                <Select
                    label="Session cookie SameSite"
                    description="Use none for cross-site credentialed fetch from Allure / CI"
                    data={[
                        { value: 'lax', label: 'lax (default browser behavior)' },
                        { value: 'none', label: 'none (cross-site cookies, HTTPS required)' },
                    ]}
                    value={form.sameSite}
                    onChange={(value) => {
                        const sameSite = (value as CorsEmbedSameSite) || 'lax';
                        setForm({
                            ...form,
                            sameSite,
                            csrfRequired: sameSite === 'none' ? true : form.csrfRequired,
                        });
                    }}
                    disabled={!form.enabled}
                    data-test="cors-embed-same-site"
                />

                <Switch
                    label="Require CSRF token"
                    description="Require X-CSRF-Token on cross-origin mutating /v1 requests"
                    checked={form.csrfRequired}
                    onChange={(e) => setForm({ ...form, csrfRequired: e.currentTarget.checked })}
                    disabled={!form.enabled || form.sameSite === 'none'}
                />

                <MultiSelect
                    label="Roles allowed to Accept (cross-origin)"
                    data={ROLE_OPTIONS}
                    value={form.allowedAcceptRoles}
                    onChange={(value) => setForm({
                        ...form,
                        allowedAcceptRoles: value as CorsEmbedRole[],
                    })}
                    disabled={!form.enabled}
                />

                <MultiSelect
                    label="Check statuses / fail reasons allowed for cross-origin Accept"
                    description="Matches check.status (new) or failReasons. Empty list = no status filter."
                    data={STATUS_OPTIONS}
                    value={form.allowedAcceptStatuses}
                    onChange={(value) => setForm({
                        ...form,
                        allowedAcceptStatuses: value as CorsEmbedAcceptStatus[],
                    })}
                    disabled={!form.enabled}
                />

                <Textarea
                    label="Extra frame-ancestors (optional)"
                    description="Additional CSP frame-ancestors origins for embedding Syngrisi UI. 'self' is always included. One per line."
                    placeholder="https://ci.example.com"
                    minRows={2}
                    value={frameAncestorsText}
                    onChange={(e) => {
                        const next = e.currentTarget.value;
                        setFrameAncestorsText(next);
                        setForm({ ...form, frameAncestors: parseOriginList(next) });
                    }}
                    disabled={!form.enabled}
                />

                <Group>
                    <Button
                        onClick={() => saveMutation.mutate(form)}
                        loading={saveMutation.isPending || isFetching}
                        disabled={!canSave}
                        data-test="cors-embed-save"
                    >
                        Save
                    </Button>
                    <Button
                        variant="light"
                        onClick={() => prepareMutation.mutate()}
                        loading={prepareMutation.isPending}
                        disabled={!form.enabled}
                        data-test="cors-embed-prepare-cookie"
                    >
                        Prepare session cookie
                    </Button>
                </Group>

                {canSave ? null : (
                    <Text size="sm" c="red">
                        Add at least one allowed origin before enabling.
                    </Text>
                )}
            </Stack>
        </Stack>
    );
}
