import React, { useState, useEffect } from 'react';
import { Paper, Title, Select, TextInput, Button, Group, Switch, Divider, PasswordInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { GenericService } from '@shared/services';
import { errorMsg } from '@shared/utils';
import { successMsg } from '@shared/utils/utils';

export const SsoSettingsForm = ({ settings, refetch }: { settings: any[], refetch: () => void }) => {
    const getVal = (name: string) => settings.find(s => s.name === name)?.value || '';

    const [enabled, setEnabled] = useState(getVal('sso_enabled') === 'true');
    const [protocol, setProtocol] = useState(getVal('sso_protocol') || 'oauth2');
    const [clientId, setClientId] = useState(getVal('sso_client_id'));
    const [clientSecret, setClientSecret] = useState(getVal('sso_client_secret'));
    const [entryPoint, setEntryPoint] = useState(getVal('sso_entry_point'));
    const [issuer, setIssuer] = useState(getVal('sso_issuer'));
    const [cert, setCert] = useState(getVal('sso_cert'));

    useEffect(() => {
        setEnabled(getVal('sso_enabled') === 'true');
        setProtocol(getVal('sso_protocol') || 'oauth2');
        setClientId(getVal('sso_client_id'));
        setClientSecret(getVal('sso_client_secret'));
        setEntryPoint(getVal('sso_entry_point'));
        setIssuer(getVal('sso_issuer'));
        setCert(getVal('sso_cert'));
    }, [settings]);

    const updateSetting = useMutation(
        (data: { name: string, value: any }) => GenericService.update('settings', data),
        {
            onError: (e: any) => errorMsg({ error: e }),
        }
    );

    const handleSave = async () => {
        try {
            await updateSetting.mutateAsync({ name: 'sso_enabled', value: String(enabled) });
            await updateSetting.mutateAsync({ name: 'sso_protocol', value: protocol });

            if (protocol === 'oauth2') {
                await updateSetting.mutateAsync({ name: 'sso_client_id', value: clientId });
                await updateSetting.mutateAsync({ name: 'sso_client_secret', value: clientSecret });
            } else {
                await updateSetting.mutateAsync({ name: 'sso_entry_point', value: entryPoint });
                await updateSetting.mutateAsync({ name: 'sso_issuer', value: issuer });
                await updateSetting.mutateAsync({ name: 'sso_cert', value: cert });
            }

            successMsg({ message: 'SSO settings saved' });
            refetch();
        } catch (e) {
            // Error handled in mutation
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
                            <PasswordInput
                                label="Client Secret"
                                value={clientSecret}
                                onChange={(e) => setClientSecret(e.currentTarget.value)}
                                mb="sm"
                            />
                        </>
                    )}

                    {protocol === 'saml' && (
                        <>
                            <TextInput
                                label="Entry Point URL"
                                value={entryPoint}
                                onChange={(e) => setEntryPoint(e.currentTarget.value)}
                                mb="sm"
                            />
                            <TextInput
                                label="Issuer (Entity ID)"
                                value={issuer}
                                onChange={(e) => setIssuer(e.currentTarget.value)}
                                mb="sm"
                            />
                            <TextInput
                                label="Certificate (Public Key)"
                                value={cert}
                                onChange={(e) => setCert(e.currentTarget.value)}
                                mb="sm"
                            />
                        </>
                    )}

                    <Button onClick={handleSave} mt="md">Save SSO Settings</Button>
                </>
            )}
        </Paper>
    );
};
