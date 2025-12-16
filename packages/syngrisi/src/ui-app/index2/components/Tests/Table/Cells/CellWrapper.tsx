import * as React from 'react';
import { Text, Tooltip } from '@mantine/core';
import { Status } from '@index/components/Tests/Table/Cells/Status';
import { StartDate } from '@index/components/Tests/Table/Cells/StartDate';
import { Os } from '@index/components/Tests/Table/Cells/Os';
import { BrowserName } from '@index/components/Tests/Table/Cells/BrowserName';
import { BrowserVersion } from '@index/components/Tests/Table/Cells/BrowserVersion';
import { Branch } from '@index/components/Tests/Table/Cells/Branch';
import { Viewport } from '@index/components/Tests/Table/Cells/ViewPort';
import { tableColumns } from '@index/components/Tests/Table/tableColumns';

interface Props {
    type: string
    test: any
    itemValue: string
}

export function CellWrapper({ type, test, itemValue }: Props) {
    const cellsMap: { [key: string]: any } = {
        status: (<Status type={type} key={type} test={test} />),
        startDate: (<StartDate type={type} key={type} test={test} itemValue={itemValue} />),
        os: (<Os type={type} key={type} test={test} itemValue={itemValue} />),
        browserName: (<BrowserName type={type} key={type} test={test} itemValue={itemValue} />),
        browserVersion: (<BrowserVersion type={type} key={type} test={test} itemValue={itemValue} />),
        branch: (<Branch type={type} key={type} test={test} itemValue={itemValue} />),
        viewport: (<Viewport type={type} key={type} test={test} />),
    };
    return cellsMap[type] || (
        <td
            key={type}
            data-test={`table-row-${tableColumns[type].label}`}
            style={{ ...tableColumns[type].cellStyle }}
        >
            <Tooltip label={test[type]} multiline withinPortal>
                <Text
                    lineClamp={1}
                    sx={{ wordBreak: 'break-all' }}
                    data-testid={type === 'name' ? `test-name-${itemValue}` : undefined}
                    aria-label={type === 'name' ? `Test name: ${itemValue}` : undefined}
                    {
                        ...{
                            [`data-table-test-${type.toLowerCase()}`]: itemValue,
                        }
                    }
                >
                    {itemValue}
                </Text>
            </Tooltip>
        </td>
    );
}
