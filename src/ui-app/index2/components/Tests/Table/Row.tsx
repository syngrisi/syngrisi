/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Checkbox, Collapse, createStyles, Text, Tooltip } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { tableColumns } from './tableColumns';
import { Checks } from './Checks/Checks';
import { testsCreateStyle } from './testsCreateStyle';
import { GenericService } from '../../../../shared/services';
import { errorMsg } from '../../../../shared/utils';
import { StartDate } from './Cells/StartDate';
import { Status } from './Cells/Status';
import { Os } from './Cells/Os';
import { BrowserName } from './Cells/BrowserName';
import { Branch } from './Cells/Branch';
import { Viewport } from './Cells/ViewPort';

const useStyles = createStyles(testsCreateStyle as any);

interface Props {
    item: any
    toggleRow: any
    toggleCollapse: any
    index: number
    visibleFields: any
    selection: any
    collapse: any
    infinityQuery: any,
}

function Cell({ type, test, itemValue }: { type: string, test: any, itemValue: string }) {
    const cellsMap: { [key: string]: any } = {
        status: (<Status type={type} key={type} test={test} />),
        startDate: (<StartDate type={type} key={type} test={test} itemValue={itemValue} />),
        os: (<Os type={type} key={type} test={test} itemValue={itemValue} />),
        browserName: (<BrowserName type={type} key={type} test={test} itemValue={itemValue} />),
        branch: (<Branch type={type} key={type} test={test} itemValue={itemValue} />),
        viewport: (<Viewport type={type} key={type} test={test} itemValue={itemValue} />),
    };
    return cellsMap[type] || (
        <td
            key={type}
            data-test={`table-row-${tableColumns[type].label}`}
            style={{ ...tableColumns[type].cellStyle }}
        >
            <Tooltip label={test[type]} multiline>
                <Text
                    lineClamp={1}
                    sx={{ wordBreak: 'break-all' }}
                >
                    {itemValue}
                </Text>
            </Tooltip>
        </td>
    );
}

export function Row(
    {
        item,
        toggleRow,
        toggleCollapse,
        index,
        visibleFields,
        selection,
        collapse,
        infinityQuery,
    }: Props,
) {
    const { classes, cx } = useStyles();
    const selected = selection.includes(item.id!);

    const testUpdateQuery = useQuery(
        [
            'testUpdateQuery',
            item._id,
        ],
        () => GenericService.get(
            'tests',
            { _id: item._id },
            {
                populate: 'checks',
                limit: '0',
            },
            'testUpdateQuery',
        ),
        {
            enabled: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    );

    const test = useMemo(() => {
        if (testUpdateQuery.data?.results?.length) return testUpdateQuery.data?.results[0];
        return item;
    }, [JSON.stringify(item), JSON.stringify(testUpdateQuery.data?.results)]);

    return (
        <>
            <tr
                data-test={`table_row_${index}`}
                className={cx({ [classes.rowSelected]: selected })}
                style={{ cursor: 'pointer' }}
                onClick={() => toggleCollapse(test.id!)}
            >

                <td>
                    <Checkbox
                        data-test="table-item-checkbox"
                        checked={selected}
                        onChange={(event) => {
                            event.stopPropagation();
                            toggleRow(test.id!);
                        }}
                        onClick={
                            (event) => {
                                event.stopPropagation();
                            }
                        }
                    />
                </td>
                {
                    Object.keys(tableColumns).map((column: string) => {
                        if (!visibleFields.includes(column)) return undefined;
                        const itemValue = column.includes('.')
                            // @ts-ignore
                            ? test[column?.split('.')[0]][column?.split('.')[1]]
                            : test[column];

                        return (
                            <Cell test={test} type={column} itemValue={itemValue} key={column} />
                        );
                    })
                }
            </tr>

            <tr>
                <td style={{ padding: 0, border: 0, width: 'auto' }} colSpan={1000}>
                    <Collapse
                        in={collapse.includes(test.id!)}
                        pl={10}
                        pr={10}
                        pt={10}
                        pb={10}
                        data-test="table-test-collapsed-row"
                    >
                        <Checks item={test} testUpdateQuery={testUpdateQuery} infinityQuery={infinityQuery} />
                    </Collapse>
                </td>
            </tr>

        </>
    );
}
