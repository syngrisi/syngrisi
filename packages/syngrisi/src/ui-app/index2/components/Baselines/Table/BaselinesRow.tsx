/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useState } from 'react';
import {
    Checkbox, ActionIcon, Tooltip, useMantineTheme, useComputedColorScheme,
} from '@mantine/core';
import { IconHistory } from '@tabler/icons-react';
import { baselinesTableColumns } from './baselinesTableColumns';
import { BaselinesCellWrapper } from './BaselinesCellWrapper';
import { testsCreateStyle } from '@index/components/Tests/Table/testsCreateStyle';
import { useNavigate } from 'react-router';
import { HistoryModal } from './Modals/HistoryModal';

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
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();
    const styles = testsCreateStyle(theme, colorScheme);
    const selected = selection.includes(item.id || item._id);
    const navigate = useNavigate();
    const [historyOpened, setHistoryOpened] = useState(false);

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
            style={{ ...(selected ? styles.rowSelected : {}), cursor: 'pointer' }}
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
            <td onClick={(e) => e.stopPropagation()} style={{ width: '1%' }}>
                <Tooltip label="History" withinPortal>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        aria-label="History"
                        data-test="baseline-history-button"
                        onClick={() => setHistoryOpened(true)}
                    >
                        <IconHistory size={16} />
                    </ActionIcon>
                </Tooltip>
                <HistoryModal
                    opened={historyOpened}
                    onClose={() => setHistoryOpened(false)}
                    baselineName={item.name}
                    ident={{
                        name: item.name,
                        app: item.app,
                        branch: item.branch,
                        browserName: item.browserName,
                        viewport: item.viewport,
                        os: item.os,
                    }}
                />
            </td>
        </tr>
    );
}
