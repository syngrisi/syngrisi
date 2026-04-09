import { Checkbox, Text } from '@mantine/core';
import React from 'react';
import { tableColumns } from '@index/components/Tests/Table/tableColumns';

interface Props {
    data: any
    toggleAllRows: any
    selection: string[]
    visibleFields: string[]

}

function Heads({ data, toggleAllRows, selection, visibleFields }: Props) {
    return (
        <tr>
            <th style={{ width: '1%' }}>
                <Checkbox
                    data-test="table-select-all"
                    title="Select all items"
                    onChange={toggleAllRows}
                    checked={selection && data ? (selection.length === data.length) : false}
                    indeterminate={
                        (selection && data)
                            ? (selection.length > 0 && selection.length !== data.length)
                            : false
                    }
                />
            </th>
            {
                Object.keys(tableColumns).map(
                    (column) => {
                        if (visibleFields.includes(column)) {
                            return (
                                <th
                                    key={column}
                                    style={{ ...tableColumns[column].headStyle }}
                                    data-test={`table-header-${tableColumns[column].label}`}
                                >
                                    <Text
                                        tt="capitalize"
                                        fw={600}
                                        style={{
                                            fontSize: '13px',
                                            lineHeight: '18px',
                                            letterSpacing: '-0.01em',
                                            fontFamily: '"Roboto","Arial",sans-serif',
                                        }}
                                    >
                                        {tableColumns[column].label}
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

export default Heads;
