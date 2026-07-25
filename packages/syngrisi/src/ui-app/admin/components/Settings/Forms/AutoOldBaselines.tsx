import React, { useEffect } from 'react';
import { Button, Switch, Group, NumberInput, Stack, Text, Title } from '@mantine/core';
import { HelpDoc } from '@admin/components/AI/HelpDoc';
import { useForm } from '@mantine/form';
import { ISettingForm } from '@admin/components/Settings/Forms/interfaces';

type AutoOldBaselinesValue = {
    days?: number;
    keepLast?: number;
    lastRunAt?: string | null;
};

const DEFAULT_DAYS = 120;
const DEFAULT_KEEP_LAST = 5;

export function AutoOldBaselines({ name, value, label, description, enabled, updateSetting }: ISettingForm) {
    const parsedValue: AutoOldBaselinesValue = typeof value === 'object' && value !== null ? value : {};

    const form = useForm({
        initialValues: {
            days: parsedValue.days ?? DEFAULT_DAYS,
            keepLast: parsedValue.keepLast ?? DEFAULT_KEEP_LAST,
            enabled,
        },
        validate: {
            days: (val) => (val && val > 0 ? null : 'Days must be greater than 0'),
            keepLast: (val) => (val && val >= 1 ? null : 'Keep last must be at least 1'),
        },
    });

    useEffect(() => {
        form.setValues({
            days: (typeof parsedValue.days === 'number' && parsedValue.days > 0)
                ? parsedValue.days
                : DEFAULT_DAYS,
            keepLast: (typeof parsedValue.keepLast === 'number' && parsedValue.keepLast >= 1)
                ? parsedValue.keepLast
                : DEFAULT_KEEP_LAST,
            enabled,
        });
    }, [parsedValue.days, parsedValue.keepLast, enabled]);

    const handleSubmit = (values: { days: number; keepLast: number; enabled: boolean }) => {
        const payload: AutoOldBaselinesValue = {
            ...parsedValue,
            days: values.days ?? DEFAULT_DAYS,
            keepLast: Math.max(1, values.keepLast ?? DEFAULT_KEEP_LAST),
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
            <Stack gap="sm">
                <Group gap={8} align="center">
                    <Title style={{ fontSize: '24px', lineHeight: '31.2px' }}>{label}</Title>
                    {description && (
                        <HelpDoc title={label} lines={[description]} dataTest={`settings_help_${name}`} />
                    )}
                </Group>
                <Group gap="xl" align="flex-end">
                    <NumberInput
                        data-test={`settings_value_${name}_days`}
                        aria-label="Days to keep baselines"
                        label="Days to keep baselines"
                        min={1}
                        step={1}
                        {...form.getInputProps('days')}
                    />
                    <NumberInput
                        data-test={`settings_value_${name}_keep_last`}
                        aria-label="Keep last baselines per identity"
                        label="Keep last (per identity)"
                        min={1}
                        step={1}
                        {...form.getInputProps('keepLast')}
                    />
                    <Switch
                        data-test={`settings_enabled_${name}`}
                        label="Enabled"
                        aria-label={`Enable ${label}`}
                        {...form.getInputProps('enabled', { type: 'checkbox' })}
                    />
                </Group>
                <Text size="xs" c="dimmed" data-test={`settings_value_${name}_last_run`}>
                    {lastRunLabel}
                </Text>
                <Group justify="flex-end">
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
