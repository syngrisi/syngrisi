import { Checkbox, Text } from '@mantine/core';
import React from 'react';
import { adminLogsTableColumns } from './adminLogsTableColumns';

interface Props {
    data: any
    toggleAllRows: any
    selection: string[]
    visibleFields: string[]

}

function TestsTableHeads({ data, toggleAllRows, selection, visibleFields }: Props) {
    return (
        <tr>
            <th style={{ width: '1%' }}>
                <Checkbox
                    data-test="table-select-all"
                    title="Select all items"
                    onChange={toggleAllRows}
                    checked={selection.length === data.length}
                    indeterminate={selection.length > 0 && selection.length !== data.length}
                    transitionDuration={0}
                />
            </th>
            {
                Object.keys(adminLogsTableColumns).map(
                    (column) => {
                        if (visibleFields.includes(column)) {
                            return (
                                <th
                                    key={column}
                                    style={{ ...adminLogsTableColumns[column].headStyle }}
                                    data-test={`table-header-${adminLogsTableColumns[column].label}`}
                                >
                                    <Text transform="capitalize">
                                        {adminLogsTableColumns[column].label}
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

export default TestsTableHeads;
