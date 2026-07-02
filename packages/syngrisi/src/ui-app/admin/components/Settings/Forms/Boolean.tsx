/* eslint-disable react/jsx-props-no-spreading */
import { Checkbox, Button, Group, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect } from 'react';
import { ISettingForm, ISettingFormUpdateData } from '@admin/components/Settings/Forms/interfaces';
import SafeSelect from '@shared/components/SafeSelect';
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
        <form onSubmit={form.onSubmit((values) => handleSubmit({ ...values, name }))}>
            <Title
                pb={20}
                style={{ fontSize: '24px', lineHeight: '31.2px' }}
            >
                {label}
            </Title>
            <Group gap="xl">
                <SafeSelect
                    data-test={`settings_value_${name}`}
                    aria-label={label}
                    style={{ width: '130px' }}
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
                    styles={{
                        label: {
                            fontSize: '24px',
                            lineHeight: '24px',
                        },
                    }}
                    aria-label={`Enable ${label}`}
                    {...form.getInputProps('enabled', { type: 'checkbox' })}
                />
            </Group>

            <Text style={{ fontSize: '24px', lineHeight: '37.2px' }}>{description}</Text>

            <Group justify="flex-end" mt="md">
                <Button
                    type="submit"
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
