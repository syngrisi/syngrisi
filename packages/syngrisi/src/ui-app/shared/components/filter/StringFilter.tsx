/* eslint-disable react/jsx-props-no-spreading,prefer-arrow-callback */
import { Group, TextInput } from '@mantine/core';
import * as React from 'react';
import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import SafeSelect from '@shared/components/SafeSelect';
import { generateItemFilter } from '@shared/utils';

interface Props {
    label: string
    groupRules: { [key: string]: any }
    updateGroupRules: any
    id: string
}

export function StringFilter({ label, groupRules, updateGroupRules, id }: Props) {
    const form = useForm({
        initialValues: {
            operator: 'eq',
            value: '',
            label,
        },
        validateInputOnChange: true,
    });

    useEffect(function valuesChanges() {
        updateGroupRules(id, generateItemFilter(label, form.values.operator, form.values.value));
    }, [form.values.value, form.values.operator, label]);

    return (
        <form>
            <Group align="start" wrap="nowrap">
                <SafeSelect
                    label=""
                    data-test="table-filter-operator"
                    aria-label="Filter operator"
                    style={{ width: '120px' }}
                    styles={{
                        input: {
                            minHeight: 36,
                            height: 36,
                            fontSize: 14,
                        },
                    }}
                    optionsData={[
                        { value: 'eq', label: 'equals' },
                        { value: 'ne', label: 'not equals' },
                        { value: 'contains', label: 'contains' },
                        { value: 'not_contains', label: 'not contains' },
                    ]}
                    {...form.getInputProps('operator')}
                />
                <TextInput
                    data-test="table-filter-value"
                    label=""
                    aria-label="Filter value"
                    title={form.getInputProps('value').value}
                    placeholder="value"
                    styles={{
                        input: {
                            minHeight: 36,
                            height: 36,
                            fontSize: 14,
                        },
                    }}
                    {...form.getInputProps('value')}
                />
            </Group>
        </form>
    );
}
