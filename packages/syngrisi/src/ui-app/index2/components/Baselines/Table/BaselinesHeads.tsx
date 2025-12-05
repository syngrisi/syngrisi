import { Checkbox, Text } from '@mantine/core';
import React from 'react';
import { baselinesTableColumns } from './baselinesTableColumns';

interface Props {
    flatData: any[]
    toggleAllRows: any
    selection: string[]
    visibleFields: string[]

}

function BaselinesHeads({ flatData, toggleAllRows, selection, visibleFields }: Props) {
    return (
        <tr>
            <th style={{ width: '1%' }}>
                <Checkbox
                    data-test="table-select-all"
                    title="Select all items"
                    onChange={toggleAllRows}
                    checked={selection && flatData ? (selection.length === flatData.length && flatData.length > 0) : false}
                    indeterminate={
                        (selection && flatData)
                            ? (selection.length > 0 && selection.length !== flatData.length)
                            : false
                    }
                    transitionDuration={0}
                />
            </th>
            {
                Object.keys(baselinesTableColumns).map(
                    (column) => {
                        if (visibleFields.includes(column)) {
                            return (
                                <th
                                    key={column}
                                    style={{ ...baselinesTableColumns[column].headStyle }}
                                    data-test={`table-header-${baselinesTableColumns[column].label}`}
                                    aria-label={`Column ${baselinesTableColumns[column].label}`}
                                >
                                    <Text transform="capitalize">
                                        {baselinesTableColumns[column].label}
                                    </Text>
                                </th>
                            );
                        }
                        return undefined;
                    },
                )
            }
        </tr>
    );
}

export default BaselinesHeads;
