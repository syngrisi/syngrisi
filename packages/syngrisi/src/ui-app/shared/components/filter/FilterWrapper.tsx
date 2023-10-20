/* eslint-disable */
import { Group, ActionIcon, Box } from '@mantine/core';
import * as React from 'react';
import SafeSelect from '../SafeSelect';
import { useInputState } from '@mantine/hooks'
import Filters from './index';
import { IconMinus } from '@tabler/icons';


interface Props {
    groupRules: { [key: string]: any }
    updateGroupRules: any
    removeGroupRule: any
    fields: any
    id: string
    testAttr: string
}

export function FilterWrapper(
    {
        groupRules,
        updateGroupRules,
        removeGroupRule,
        fields,
        id,
        testAttr,
    }: Props
) {
    const optionsData = Object.keys(fields).map((column) => {
        return { value: column, label: fields[column].label }
    })
    const [selectValue, setSelectValue]: [string, any] = useInputState(optionsData[0].value);
    // @ts-ignore
    const Filter = Filters[fields[selectValue].type];
    return (
        <Group
            pt={16}
            align="start"
            noWrap
            data-test={testAttr}
        >
            <SafeSelect
                data-test="table-filter-column-name"
                sx={{ width: '130px' }}
                optionsData={optionsData}
                value={selectValue}
                onChange={setSelectValue}
            />
            <Filter
                key={selectValue}
                label={selectValue}
                groupRules={groupRules}
                updateGroupRules={updateGroupRules}
                id={id}
            />

            {
                (testAttr !== 'filter-rule-0')
                    ? (
                        <ActionIcon
                            color="red"
                            variant="light"
                            onClick={() => removeGroupRule(id)}
                            size={24}
                            mt={4}
                            ml={-8}
                        >
                            {/*<ThemeIcon color="red" size={24} variant="light">*/}
                            <IconMinus stroke={1} />
                            {/*</ThemeIcon>*/}
                        </ActionIcon>
                    )
                    : (
                        <Box sx={{ width: 18 }}>
                        </Box>
                    )
            }
        </Group>
    );
}
