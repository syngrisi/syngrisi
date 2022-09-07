/* eslint-disable */
import { Group } from '@mantine/core';
import * as React from 'react';
import SafeSelect from '../SafeSelect';
import { useInputState } from '@mantine/hooks'
import Filters from './index';


interface Props {
    filtersSet: { [key: string]: any }
    updateFilterSet: any
    fields: any
}


export function FilterWrapper({ filtersSet, updateFilterSet, fields }: Props) {
    const optionsData = Object.keys(fields).map((item) => {
        return { value: item, label: item.charAt(0).toUpperCase() + item.slice(1) }
    })
    const [selectValue, setSelectValue] = useInputState(optionsData[0].value);
    const Filter = Filters[fields[selectValue].type];
    return (
        <Group noWrap>
            <SafeSelect
                label="Field"
                data-test="string-filter-operators"
                sx={{ width: '130px' }}
                optionsData={optionsData}
                value={selectValue}
                onChange={setSelectValue}
            />
            <Filter label={selectValue} filtersSet={filtersSet} updateFilterSet={updateFilterSet} />

        </Group>
    );
}
