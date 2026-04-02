/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Checkbox, Collapse, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { tableColumns } from '@index/components/Tests/Table/tableColumns';
import { Checks } from '@index/components/Tests/Table/Checks/Checks';
import { testsCreateStyle } from '@index/components/Tests/Table/testsCreateStyle';
import { GenericService } from '@shared/services';
import { errorMsg } from '@shared/utils';
import { CellWrapper } from '@index/components/Tests/Table/Cells/CellWrapper';

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

export const Row = memo(function Row(
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
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();
    const styles = testsCreateStyle(theme, colorScheme);
    const selected = selection.includes(item.id!);
    const collapsed = collapse.includes(item.id!);

    // Only mount Checks after first expansion to avoid unnecessary API queries
    const [hasBeenExpanded, setHasBeenExpanded] = useState(false);
    useEffect(() => {
        if (collapsed && !hasBeenExpanded) setHasBeenExpanded(true);
    }, [collapsed]);

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
    }, [item, testUpdateQuery.dataUpdatedAt]);

    const handleRowClick = useCallback(() => toggleCollapse(item.id!), [toggleCollapse, item.id]);
    const handleCheckboxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        toggleRow(item.id!);
    }, [toggleRow, item.id]);
    const handleCheckboxClick = useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
    }, []);

    return (
        <>
            <tr
                data-test={`table_row_${index}`}
                data-row-name={test.name}
                style={{ ...(selected ? styles.rowSelected : {}), cursor: 'pointer' }}
                onClick={handleRowClick}
            >

                <td>
                    <Checkbox
                        data-test="table-item-checkbox"
                        data-test-checkbox-name={test.name}
                        checked={selected}
                        onChange={handleCheckboxChange}
                        onClick={handleCheckboxClick}
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
                            <CellWrapper test={test} type={column} itemValue={itemValue} key={column} />
                        );
                    })
                }
            </tr>

            <tr>
                <td style={{ padding: 0, border: 0, width: 'auto' }} colSpan={1000}>
                    <Collapse
                        in={collapsed}
                        pl={10}
                        pr={10}
                        pt={10}
                        pb={10}
                        data-test="table-test-collapsed-row"
                        transitionDuration={200}
                        transitionTimingFunction="ease-out"
                    >
                        {hasBeenExpanded && (
                            <Checks item={test} testUpdateQuery={testUpdateQuery} infinityQuery={infinityQuery} />
                        )}
                    </Collapse>
                </td>
            </tr>

        </>
    );
});
