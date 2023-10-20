/* eslint-disable react/jsx-props-no-spreading */
import { Checkbox, Button, Group, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';
import { ISettingForm, ISettingFormUpdateData } from './interfaces';
import SafeSelect from '../../../../shared/components/SafeSelect';
// actually this component not represent boolean data,
// this is string in boolean-like view "true" / "false"
function Boolean({ name, value, label, description, enabled, updateSetting }: ISettingForm) {
    const form = useForm(
        {
            initialValues: {
                value,
                enabled,
            },
        },
    );

    const handleSubmit = (values: ISettingFormUpdateData) => {
        updateSetting.mutate(values);
    };

    return (
        <form onSubmit={form.onSubmit((values) => handleSubmit({ ...values, name }))}>
            <Title size="sm" pb={20}>{label}</Title>
            <Group spacing="xl">
                <SafeSelect
                    data-test={`settings_value_${name}`}
                    sx={{ width: '130px' }}
                    size="md"
                    optionsData={[
                        { value: 'true', label: 'true' },
                        { value: 'false', label: 'false' },
                    ]}
                    {...form.getInputProps('value')}
                />
                <Checkbox
                    data-test={`settings_enabled_${name}`}
                    size="md"
                    label="enabled"
                    {...form.getInputProps('enabled', { type: 'checkbox' })}
                />
            </Group>

            <Text>{description}</Text>

            <Group position="right" mt="md">
                <Button
                    type="submit"
                    data-test={`settings_update_button_${name}`}
                >
                    Update
                </Button>
            </Group>
        </form>
    );
}

export { Boolean };
