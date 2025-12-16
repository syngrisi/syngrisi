/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Checkbox, createStyles } from '@mantine/core';
import { baselinesTableColumns } from './baselinesTableColumns';
import { BaselinesCellWrapper } from './BaselinesCellWrapper';
import { testsCreateStyle } from '@index/components/Tests/Table/testsCreateStyle';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles(testsCreateStyle as any);

interface Props {
    item: any
    toggleRow: any
    index: number
    visibleFields: any
    selection: any
}

export function BaselinesRow(
    {
        item,
        toggleRow,
        index,
        visibleFields,
        selection,
    }: Props,
) {
    const { classes, cx } = useStyles();
    const selected = selection.includes(item.id || item._id);
    const navigate = useNavigate();

    const handleRowClick = () => {
        // snapshootId is just an ObjectId string, not a populated document
        const snapshootId = item.snapshootId;
        
        if (snapshootId) {
             const filter = JSON.stringify({ baselineSnapshotId: snapshootId });
             navigate(`/?filter=${encodeURIComponent(filter)}`);
        }
    };

    return (
        <tr
            data-test={`table_row_${index}`}
            data-row-name={item.name}
            aria-label={`Baseline row ${item.name}`}
            className={cx({ [classes.rowSelected]: selected })}
            style={{ cursor: 'pointer' }}
            onClick={handleRowClick}
        >
            <td onClick={(e) => e.stopPropagation()}>
                <Checkbox
                    data-test="table-item-checkbox"
                    checked={selected}
                    onChange={(event) => {
                        toggleRow(item.id || item._id);
                    }}
                />
            </td>
            {
                Object.keys(baselinesTableColumns).map((column: string) => {
                    if (!visibleFields.includes(column)) return undefined;
                    const itemValue = item[column];

                    return (
                        <BaselinesCellWrapper type={column} baseline={item} itemValue={itemValue} key={column} />
                    );
                })
            }
        </tr>
    );
}
