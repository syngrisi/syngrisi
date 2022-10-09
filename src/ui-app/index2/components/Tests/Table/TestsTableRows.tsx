/* eslint-disable react/jsx-one-expression-per-line */
import { Checkbox, Collapse, createStyles, Paper, RingProgress, Text, Tooltip } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { IPage } from '../../../../shared/interfaces/logQueries';
import ILog from '../../../../shared/interfaces/ILog';
import { adminLogsTableColumns } from './adminLogsTableColumns';
import { testsCreateStyle } from './testsCreateStyle';
import UnfoldActionIcon from '../UnfoldActionIcon';
import { AppContext } from '../../../AppContext';

const useStyles = createStyles(testsCreateStyle as any);

const logLevelColorMap: { [key: string]: string } = {
    debug: 'blue',
    info: 'green',
    warn: 'orange',
    error: 'red',
};

interface Props {
    data: any,
    selection: any,
    setSelection: any,
    visibleFields: string[]
}

const TestsTableRows = ({ data, selection, setSelection, visibleFields }: Props) => {
    const { classes, cx } = useStyles();
    const [collapse, setCollapse]: [string[], any] = useState([]);
    const { updateToolbar }: any = useContext(AppContext);

    const toggleCollapse = (id: string) => {
        setCollapse(
            (current: any) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]),
        );
    };

    const expand = (id: string) => {
        setCollapse(
            (current: any) => {
                if (!current.includes(id)) {
                    return [...current, id];
                }
                return current;
            },
        );
    };
    const fold = (id: string) => {
        setCollapse(
            (current: any) => {
                if (current.includes(id)) {
                    return current.filter((item: string) => item !== id);
                }
                return current;
            },
        );
    };

    const expandSelected = () => {
        selection.forEach((item: string) => expand(item));
    };

    const collapseSelected = () => {
        selection.forEach((item: string) => fold(item));
    };

    useEffect(() => {
        updateToolbar(
            <UnfoldActionIcon
                mounted={selection.length > 0}
                expandSelected={expandSelected}
                collapseSelected={collapseSelected}
            />,
            30,
        );
    }, [selection.length]);

    const toggleRow = (id: string) => setSelection(
        (current: any) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]),
    );

    return data.pages.map((page: IPage<ILog>) => (
        page.results.map(
            (item: ILog, index: number) => {
                const selected = selection.includes(item.id!);
                return (
                    <React.Fragment key={item.id}>
                        <tr
                            data-test={`table_row_${index}`}
                            className={cx({ [classes.rowSelected]: selected })}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleCollapse(item.id!)}
                        >

                            <td>
                                <Checkbox
                                    data-test="table-item-checkbox"
                                    checked={selected}
                                    onChange={(event) => {
                                        event.stopPropagation();
                                        toggleRow(item.id!);
                                    }}
                                    onClick={
                                        (event) => {
                                            event.stopPropagation();
                                        }
                                    }
                                />
                            </td>
                            {
                                Object.keys(adminLogsTableColumns).map((column: string) => {
                                    if (!visibleFields.includes(column)) return undefined;
                                    const itemValue = column.includes('.')
                                        // @ts-ignore
                                        ? item[column?.split('.')[0]][column?.split('.')[1]]
                                        : item[column];

                                    if (column === 'level') {
                                        return (
                                            <td
                                                key={column}
                                                title={item.level}
                                                data-test={`table-row-${adminLogsTableColumns[column].label}`}
                                                style={{
                                                    ...adminLogsTableColumns[column].cellStyle,
                                                    paddingLeft: '2px',
                                                }}
                                            >
                                                <RingProgress
                                                    sections={[{
                                                        value: 100,
                                                        color: logLevelColorMap[item.level!],
                                                    }]}
                                                    size={48}
                                                />
                                            </td>
                                        );
                                    }

                                    return (
                                        <td
                                            key={column}
                                            data-test={`table-row-${adminLogsTableColumns[column].label}`}
                                            style={{ ...adminLogsTableColumns[column].cellStyle }}
                                        >
                                            <Tooltip label={item[column]} multiline>
                                                <Text
                                                    lineClamp={1}
                                                    sx={{ wordBreak: 'break-all' }}
                                                >
                                                    {itemValue}
                                                </Text>
                                            </Tooltip>
                                        </td>
                                    );
                                })
                            }
                        </tr>

                        <tr>
                            <td style={{ padding: 0, border: 0, width: 'auto' }} colSpan={1000}>
                                <Collapse
                                    in={collapse.includes(item.id!)}
                                    pl={10}
                                    pr={10}
                                    pt={10}
                                    pb={10}
                                    data-test="table-item-collapsed-row"
                                >
                                    <Paper p={20}>
                                        <Text
                                            size={16}
                                            color={logLevelColorMap[item.level!]}
                                            component="span"
                                            // sx={{ display: 'inline-block' }}

                                        >
                                            {item.level}{': '}
                                        </Text>
                                        <Text
                                            size={16}
                                            sx={{ wordBreak: 'break-all' }}
                                            color={logLevelColorMap[item.level!]}
                                            component="span"
                                        >
                                            <pre>
                                                {item.message}
                                            </pre>
                                        </Text>
                                    </Paper>
                                </Collapse>
                            </td>
                        </tr>

                    </React.Fragment>
                );
            },
        )
    ));
};

export default TestsTableRows;
