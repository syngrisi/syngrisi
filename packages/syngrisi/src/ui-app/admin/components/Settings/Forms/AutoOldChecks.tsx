import React, { useEffect } from 'react';
import { Button, Checkbox, Group, NumberInput, Stack, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ISettingForm } from '@admin/components/Settings/Forms/interfaces';

type AutoOldChecksValue = {
    days?: number;
    lastRunAt?: string | null;
};

export function AutoOldChecks({ name, value, label, description, enabled, updateSetting }: ISettingForm) {
    const parsedValue: AutoOldChecksValue = typeof value === 'object' && value !== null ? value : {};

    const form = useForm({
        initialValues: {
            days: parsedValue.days ?? 365,
            enabled,
        },
        validate: {
            days: (val) => (val && val > 0 ? null : 'Days must be greater than 0'),
        },
    });

    useEffect(() => {
        form.setValues({
            days: (typeof parsedValue.days === 'number' && parsedValue.days > 0) ? parsedValue.days : 365,
            enabled,
        });
    }, [parsedValue.days, enabled]);

    const handleSubmit = (values: { days: number; enabled: boolean }) => {
        const payload: AutoOldChecksValue = {
            ...parsedValue,
            days: values.days ?? 365,
        };
        updateSetting?.mutate({
            name,
            enabled: values.enabled,
            value: payload,
        });
    };

    const lastRunLabel = parsedValue.lastRunAt
        ? `Last run: ${new Date(parsedValue.lastRunAt).toLocaleString()}`
        : 'Last run: never';

    return (
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Stack spacing="sm">
                <Title size="sm">{label}</Title>
                <Group spacing="xl" align="flex-end">
                    <NumberInput
                        data-test={`settings_value_${name}_days`}
                        aria-label="Days to keep checks"
                        label="Days to keep checks"
                        min={1}
                        step={1}
                        {...form.getInputProps('days')}
                    />
                    <Checkbox
                        data-test={`settings_enabled_${name}`}
                        label="Enabled"
                        aria-label={`Enable ${label}`}
                        {...form.getInputProps('enabled', { type: 'checkbox' })}
                    />
                </Group>
                <Text size="sm">{description}</Text>
                <Text size="xs" color="dimmed" data-test={`settings_value_${name}_last_run`}>
                    {lastRunLabel}
                </Text>
                <Group position="right">
                    <Button
                        type="submit"
                        data-test={`settings_update_button_${name}`}
                        aria-label={`Update ${label}`}
                    >
                        Update
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}
