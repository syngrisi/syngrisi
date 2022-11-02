import * as React from 'react';
import { Text, Tooltip } from '@mantine/core';
import * as dateFns from 'date-fns';
import { tableColumns } from '../tableColumns';

interface Props {
    type: string
    test: any
    itemValue: string
}
export function StartDate({ type, test, itemValue }: Props) {
    return (
        <td
            key={type}
            title={test.level}
            data-test={`table-row-${tableColumns[type].label}`}
            style={{
                ...tableColumns[type].cellStyle,
                paddingLeft: '2px',
            }}
        >
            <Tooltip label={itemValue} withinPortal>
                <Text
                    lineClamp={1}
                    sx={{ wordBreak: 'break-all' }}
                >
                    {
                        dateFns.format(dateFns.parseISO(itemValue), 'yyyy-MM-dd HH:mm:ss')
                    }
                </Text>
            </Tooltip>
        </td>
    );
}
