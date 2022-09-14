/* eslint-disable react/jsx-props-no-spreading */
import { Checkbox, Button, Group, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';
import { ISettingForm, ISettingFormUpdateData } from './interfaces';
import SafeSelect from '../../../../shared/components/SafeSelect';

function Boolean({ name, value, label, description, enabled, updateSetting }: ISettingForm) {
    const form = useForm(
        {
            initialValues: {
                value,
                enabled,
            },

            validate: {},
        },
    );

    const handleSubmit = (values: ISettingFormUpdateData) => {
        updateSetting.mutate(values);
    };

    return (
        <form onSubmit={form.onSubmit((values) => handleSubmit({ ...values, name }))}>
            <Title pb={20}>{label}</Title>
            <Group spacing="xl">
                <SafeSelect
                    sx={{ width: '130px' }}
                    size="lg"
                    optionsData={[
                        { value: true, label: 'true' },
                        { value: false, label: 'false' },
                    ]}
                    {...form.getInputProps('value')}
                />
                <Checkbox
                    size="xl"
                    label="enabled"
                    {...form.getInputProps('enabled', { type: 'checkbox' })}
                />
            </Group>

            <Text>{description}</Text>

            <Group position="right" mt="md">
                <Button type="submit">Update</Button>
            </Group>
        </form>
    );
}

export { Boolean };
