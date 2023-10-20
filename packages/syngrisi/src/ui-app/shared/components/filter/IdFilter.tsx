/* eslint-disable */
import { Group, TextInput } from '@mantine/core';
import * as React from 'react';
import { useEffect } from 'react';
import SafeSelect from '../SafeSelect';
import { useForm } from '@mantine/form';
import { generateItemFilter } from '../../utils';

interface Props {
    label: string
    groupRules: { [key: string]: any }
    updateGroupRules: any
    id: string
}

export function IdFilter({ label, groupRules, updateGroupRules, id }: Props) {

    const form = useForm({
        initialValues: {
            operator: 'eq',
            value: '',
            label: label,
        },
        validateInputOnChange: true,
        validate: {
            value: (value) => {
                return /^[0-9a-fA-F]{24,24}$/.test(value) ? null : 'Invalid id'
            },
        },
    });

    useEffect(function valuesChanges() {
        updateGroupRules(id, generateItemFilter(label, form.values.operator, form.values.value));
    }, [form.values.value, form.values.operator, label]);

    return (
        <form>
            <Group align="start" noWrap>
                <SafeSelect
                    label=""
                    data-test="table-filter-operator"
                    sx={{ width: '130px' }}
                    optionsData={[
                        { value: 'eq', label: 'equals' },
                        { value: 'ne', label: 'not equals' },
                        { value: 'lt', label: 'less than' },
                        { value: 'gt', label: 'more than' },
                    ]}
                    {...form.getInputProps('operator')}
                />
                <TextInput
                    data-test="table-filter-value"
                    title={form.getInputProps('value').value}
                    placeholder="value"
                    {...form.getInputProps('value')}
                />
            </Group>
        </form>
    );
}
