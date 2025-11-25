import React, { useState, useEffect } from 'react';
import { Paper, Title, Select, TextInput, Button, Switch, Text, Badge, Group, Alert } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GenericService } from '@shared/services';
import { errorMsg } from '@shared/utils';
import { successMsg } from '@shared/utils/utils';
import ky from 'ky';
import config from '@config';

interface SecretsStatus {
    clientSecretConfigured: boolean;
    certConfigured: boolean;
}

const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid (not required)
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const SsoSettingsForm = ({ settings, refetch }: { settings: any[], refetch: () => void }) => {
    const getVal = (name: string) => settings.find(s => s.name === name)?.value || '';

    const [enabled, setEnabled] = useState(getVal('sso_enabled') === 'true');
    const [protocol, setProtocol] = useState(getVal('sso_protocol') || 'oauth2');
    const [clientId, setClientId] = useState(getVal('sso_client_id'));
    const [entryPoint, setEntryPoint] = useState(getVal('sso_entry_point'));
    const [issuer, setIssuer] = useState(getVal('sso_issuer'));
    const [entryPointError, setEntryPointError] = useState('');

    // Fetch secrets configuration status from server
    const { data: secretsStatus } = useQuery<SecretsStatus>(
        ['sso-secrets-status'],
        () => ky.get(`${config.baseUri}/v1/auth/sso/secrets-status`).json<SecretsStatus>(),
        { refetchOnWindowFocus: false }
    );

    useEffect(() => {
        setEnabled(getVal('sso_enabled') === 'true');
        setProtocol(getVal('sso_protocol') || 'oauth2');
        setClientId(getVal('sso_client_id'));
        setEntryPoint(getVal('sso_entry_point'));
        setIssuer(getVal('sso_issuer'));
    }, [settings]);

    const updateSetting = useMutation(
        (data: { name: string, value: any }) => GenericService.update('settings', data),
        {
            onError: (e: any) => errorMsg({ error: e }),
        }
    );

    const handleSave = async () => {
        // Validate URL before saving
        if (protocol === 'saml' && entryPoint && !validateUrl(entryPoint)) {
            setEntryPointError('Invalid Entry Point URL');
            errorMsg({ message: 'Invalid Entry Point URL' });
            return;
        }
        setEntryPointError('');

        try {
            await updateSetting.mutateAsync({ name: 'sso_enabled', value: String(enabled) });
            await updateSetting.mutateAsync({ name: 'sso_protocol', value: protocol });

            if (protocol === 'oauth2') {
                await updateSetting.mutateAsync({ name: 'sso_client_id', value: clientId });
                // Note: Client secret is configured via SSO_CLIENT_SECRET env var
            } else {
                await updateSetting.mutateAsync({ name: 'sso_entry_point', value: entryPoint });
                await updateSetting.mutateAsync({ name: 'sso_issuer', value: issuer });
                // Note: Certificate is configured via SSO_CERT env var
            }

            successMsg({ message: 'SSO settings saved' });
            refetch();
        } catch (e) {
            errorMsg({ error: e, message: 'Failed to save SSO settings' });
        }
    };

    return (
        <Paper withBorder p={20} m={15} sx={{ width: '90%' }}>
            <Title order={4} mb="md">SSO Configuration</Title>
            <Switch
                label="Enable SSO"
                checked={enabled}
                onChange={(e) => setEnabled(e.currentTarget.checked)}
                mb="md"
            />

            {enabled && (
                <>
                    <Select
                        label="Protocol"
                        data={[
                            { value: 'oauth2', label: 'OAuth2 (Google)' },
                            { value: 'saml', label: 'SAML2' }
                        ]}
                        value={protocol}
                        onChange={(val) => setProtocol(val || 'oauth2')}
                        mb="md"
                    />

                    {protocol === 'oauth2' && (
                        <>
                            <TextInput
                                label="Client ID"
                                value={clientId}
                                onChange={(e) => setClientId(e.currentTarget.value)}
                                mb="sm"
                            />
                            <Group spacing="xs" mb="sm">
                                <Text size="sm">Client Secret:</Text>
                                <Badge color={secretsStatus?.clientSecretConfigured ? 'green' : 'red'}>
                                    {secretsStatus?.clientSecretConfigured ? 'Configured via ENV' : 'Not configured'}
                                </Badge>
                            </Group>
                            {!secretsStatus?.clientSecretConfigured && (
                                <Alert color="yellow" mb="sm">
                                    Set the SSO_CLIENT_SECRET environment variable to configure the client secret securely.
                                </Alert>
                            )}
                        </>
                    )}

                    {protocol === 'saml' && (
                        <>
                            <TextInput
                                label="Entry Point URL"
                                value={entryPoint}
                                onChange={(e) => {
                                    setEntryPoint(e.currentTarget.value);
                                    setEntryPointError('');
                                }}
                                error={entryPointError}
                                mb="sm"
                            />
                            <TextInput
                                label="Issuer (Entity ID)"
                                value={issuer}
                                onChange={(e) => setIssuer(e.currentTarget.value)}
                                mb="sm"
                            />
                            <Group spacing="xs" mb="sm">
                                <Text size="sm">Certificate:</Text>
                                <Badge color={secretsStatus?.certConfigured ? 'green' : 'red'}>
                                    {secretsStatus?.certConfigured ? 'Configured via ENV' : 'Not configured'}
                                </Badge>
                            </Group>
                            {!secretsStatus?.certConfigured && (
                                <Alert color="yellow" mb="sm">
                                    Set the SSO_CERT environment variable to configure the certificate securely.
                                </Alert>
                            )}
                        </>
                    )}

                    <Button onClick={handleSave} mt="md">Save SSO Settings</Button>
                </>
            )}
        </Paper>
    );
};
