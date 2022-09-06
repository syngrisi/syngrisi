import { Checkbox, Text } from '@mantine/core';
import React from 'react';
import { adminLogsTableColumns } from './adminLogsTableColumns';

interface Props {
    data: any
    toggleAllRows: any
    selection: string[]
    visibleFields: string[]

}

function AdminLogsTableHeads({ data, toggleAllRows, selection, visibleFields }: Props) {
    return (
        <tr>
            <th style={{ width: '1%' }}>
                <Checkbox
                    onChange={toggleAllRows}
                    checked={selection.length === data.length}
                    indeterminate={selection.length > 0 && selection.length !== data.length}
                    transitionDuration={0}
                />
            </th>
            {
                Object.keys(adminLogsTableColumns).map(
                    (name) => {
                        if (visibleFields.includes(name)) {
                            return (
                                <th
                                    key={name}
                                    style={{ ...adminLogsTableColumns[name].headStyle }}
                                >
                                    <Text transform="capitalize">
                                        {name}
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

export default AdminLogsTableHeads;
