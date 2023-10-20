/* eslint-disable react/jsx-props-no-spreading,react-hooks/exhaustive-deps */
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { Group } from '@mantine/core';
import { GenericService } from '../../services';
import { errorMsg, generateItemFilter } from '../../utils';
import SafeSelect from '../SafeSelect';

interface FilterItems {
    value: string,
    label: string,
}

interface Props {
    label: string
    updateGroupRules: any
    id: string
    resource: string
}

export function CommonDistinctFilter({ label, updateGroupRules, id, resource }: Props) {
    const distinctQuery = useQuery(
        {
            queryKey: [resource],
            queryFn: () => GenericService.get(
                resource,
                {},
                {
                    page: '1',
                    limit: '50',
                },
                resource,
            ),
            // enabled: false,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            onError: (e: any) => {
                errorMsg({ error: e });
            },
            // eslint-disable-next-line no-unused-vars
            onSuccess: (result: any) => {

            },
        },
    );

    let items: FilterItems[] = [];
    if (distinctQuery.isSuccess && distinctQuery?.data?.results) {
        items = distinctQuery.data?.results
            ?.map((item: { name: string }) => item.name)
            ?.map((item: FilterItems) => ({ value: item, label: item }));
    }

    if (distinctQuery.error) items = [{ value: '', label: 'error loading filter items' }];

    const form = useForm({
        initialValues: {
            operator: 'eq',
            value: distinctQuery.data ? distinctQuery?.data.results[0].name : '',
            label,
        },
        validateInputOnChange: true,
    });

    useEffect(() => {
        if (distinctQuery?.data?.results[0]?.name) {
            form.setFieldValue('value', distinctQuery?.data.results[0].name);
        }
    }, [distinctQuery?.data?.results[0]?.name]);

    useEffect(() => {
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
                        { value: 'contains', label: 'contains' },
                        { value: 'not_contains', label: 'not contains' },
                    ]}
                    {...form.getInputProps('operator')}
                />

                <SafeSelect
                    data-test="table-filter-value"
                    // sx={{ width: '150px' }}
                    title={form.getInputProps('value').value}
                    optionsData={items}
                    loaded={distinctQuery.isLoading}
                    {...form.getInputProps('value')}
                />
            </Group>
        </form>
    );
}
