/* eslint-disable */
import { Group } from '@mantine/core';
import * as React from 'react';
import { useEffect } from 'react';
import SafeSelect from '../SafeSelect';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { generateItemFilter } from '../../utils';

interface Props {
    label: string
    groupRules: { [key: string]: any }
    updateGroupRules: any
    id: string
}

export function DateFilter({ label, groupRules, updateGroupRules, id }: Props) {

    const form = useForm({
        initialValues: {
            operator: 'lt',
            value: '',
            label: label,
        },
        validateInputOnChange: true,
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
                        { value: 'lt', label: 'less than' },
                        { value: 'gt', label: 'more than' },
                    ]}
                    {...form.getInputProps('operator')}
                />
                <DatePicker
                    data-test="table-filter-value"
                    title={form.getInputProps('value').value}
                    placeholder="value"
                    {...form.getInputProps('value')}
                />
            </Group>
        </form>
    );
}
