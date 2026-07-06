/* eslint-disable react/jsx-props-no-spreading */
import { Switch, Button, Group, Title, Alert, Badge } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import React, { useEffect } from 'react';
import { HelpDoc } from '@admin/components/AI/HelpDoc';
import { ISettingForm, ISettingFormUpdateData } from '@admin/components/Settings/Forms/interfaces';
// actually this component not represent boolean data,
// this is string in boolean-like view "true" / "false"
function Boolean({ name, value, label, description, enabled, envControlled, envVariable, updateSetting }: ISettingForm) {
    const form = useForm(
        {
            initialValues: {
                value,
                enabled,
            },
        },
    );

    // Resync the form to fresh props (e.g. after save or a react-query
    // refetch-on-window-focus), otherwise the shown value/enabled would
    // stay frozen at the initial values forever.
    useEffect(() => {
        form.setValues({ value, enabled });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, enabled]);

    const handleSubmit = (values: ISettingFormUpdateData) => {
        updateSetting.mutate(values);
    };

    return (
        // The persistent setting keeps a separate `enabled` flag, but for a plain
        // on/off toggle a second switch is redundant — the value switch is the only
        // control and we always keep the setting `enabled`.
        <form onSubmit={form.onSubmit((values) => handleSubmit({ ...values, enabled: true, name }))}>
            <Group gap={8} align="center" pb={20}>
                <Title style={{ fontSize: '24px', lineHeight: '31.2px' }}>
                    {label}
                </Title>
                {description && (
                    <HelpDoc
                        title={label}
                        lines={[description]}
                        dataTest={`settings_help_${name}`}
                    />
                )}
            </Group>
            <Group gap="xl">
                <Switch
                    data-test={`settings_value_${name}`}
                    aria-label={label}
                    size="md"
                    label={label}
                    disabled={envControlled}
                    checked={form.values.value === 'true'}
                    onChange={(e) => form.setFieldValue('value', e.currentTarget.checked ? 'true' : 'false')}
                />
                {envControlled && (
                    <Badge
                        color="gray"
                        variant="light"
                        size="lg"
                        leftSection={<IconLock size={14} />}
                        data-test={`settings_env_badge_${name}`}
                    >
                        Set by {envVariable}
                    </Badge>
                )}
            </Group>

            {envControlled && (
                <Alert
                    icon={<IconLock size={18} />}
                    color="blue"
                    variant="light"
                    mt="md"
                    data-test={`settings_env_locked_${name}`}
                >
                    {form.values.value === 'true' ? 'Enabled' : 'Disabled'} by the administrator via the
                    {' '}<b>{envVariable}</b> environment variable. Change it in the environment, not here.
                </Alert>
            )}

            <Group justify="flex-end" mt="md">
                <Button
                    type="submit"
                    disabled={envControlled}
                    data-test={`settings_update_button_${name}`}
                    aria-label={`Update ${label}`}
                >
                    Update
                </Button>
            </Group>
        </form>
    );
}

export { Boolean };
