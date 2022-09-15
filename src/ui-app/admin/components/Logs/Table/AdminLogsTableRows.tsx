/* eslint-disable react/jsx-one-expression-per-line */
import { Checkbox, Collapse, createStyles, Paper, RingProgress, Text, Tooltip } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { IPage } from '../../../../shared/interfaces/logQueries';
import ILog from '../../../../shared/interfaces/ILog';
import { adminLogsTableColumns } from './adminLogsTableColumns';
import { adminLogsCreateStyle } from './adminLogsCreateStyle';
import UnfoldActionIcon from '../UnfoldActionIcon';
import { AppContext } from '../../../AppContext';

const useStyles = createStyles(adminLogsCreateStyle as any);

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

const AdminLogsTableRows = ({ data, selection, setSelection, visibleFields }: Props) => {
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
        if (selection.length > 0) {
            updateToolbar(
                <UnfoldActionIcon
                    expandSelected={expandSelected}
                    collapseSelected={collapseSelected}
                />,
                4,
            );
        } else {
            updateToolbar('', 4);
        }
    }, [selection.length]);

    const toggleRow = (id: string) => setSelection(
        (current: any) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]),
    );

    return data.pages.map((page: IPage<ILog>) => (
        page.results.map(
            (item: ILog) => {
                const selected = selection.includes(item.id!);
                return (
                    <React.Fragment key={item.id}>
                        <tr
                            className={cx({ [classes.rowSelected]: selected })}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleCollapse(item.id!)}
                        >

                            <td>
                                <Checkbox
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
                                Object.keys(adminLogsTableColumns).map((label) => {
                                    if (!visibleFields.includes(label)) return undefined;

                                    if (label === 'level') {
                                        return (
                                            <td
                                                key={label}
                                                title={item.level}
                                                style={{
                                                    ...adminLogsTableColumns[label].cellStyle,
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
                                            key={label}
                                            style={{ ...adminLogsTableColumns[label].cellStyle }}
                                        >
                                            <Tooltip label={item[label]} multiline>
                                                <Text
                                                    lineClamp={1}
                                                    sx={{ wordBreak: 'break-all' }}
                                                >
                                                    {item[label]}
                                                </Text>
                                            </Tooltip>
                                        </td>
                                    );
                                })
                            }
                        </tr>

                        <tr>
                            <td style={{ padding: 0, border: 0, width: 'auto' }} colSpan={1000}>
                                <Collapse in={collapse.includes(item.id!)} pl={10} pr={10} pt={10} pb={10}>
                                    <Paper p={10}>
                                        <Text
                                            size="md"
                                            color={logLevelColorMap[item.level!]}
                                            component="span"
                                            // sx={{ display: 'inline-block' }}

                                        >
                                            {item.level}{': '}
                                        </Text>
                                        <Text
                                            size="md"
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

export default AdminLogsTableRows;
