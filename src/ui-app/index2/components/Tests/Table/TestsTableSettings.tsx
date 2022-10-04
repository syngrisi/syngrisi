import * as React from 'react';
import {
    ActionIcon,
    Chip,
    Group,
    Text,
} from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useInputState, useToggle } from '@mantine/hooks';
import { adminLogsTableColumns } from './adminLogsTableColumns';
import RelativeDrawer from '../../../../shared/components/RelativeDrawer';
import SafeSelect from '../../../../shared/components/SafeSelect';
import { SearchParams } from '../../../../shared/utils';

interface Props {
    open: boolean
    setSortOpen: any,
    visibleFields: any
    setVisibleFields: any
    searchParams: any
    setSearchParams: any
}

function TestsTableSettings(
    {
        open,
        setSortOpen,
        visibleFields,
        setVisibleFields,
        searchParams,
        setSearchParams,
    }: Props,
) {
    const [sortOrder, toggleSortOrder] = useToggle(['desc', 'asc']);
    const [selectOptionsData] = useState(() => Object.keys(adminLogsTableColumns)
        .map((column) => ({ value: column, label: adminLogsTableColumns[column].label })));

    const [sortItemValue, setSortItemValue] = useInputState('startDate');

    useEffect(() => {
        SearchParams.changeSorting(searchParams, setSearchParams, sortItemValue, sortOrder);
    }, [sortItemValue, sortOrder]);

    return (
        <RelativeDrawer
            open={open}
            setOpen={setSortOpen}
            title="Settings"
            width={260}
        >
            <Group align="end" spacing="sm" noWrap>
                <SafeSelect
                    label="Sort by"
                    data-test="table-sort-by-select"
                    optionsData={selectOptionsData}
                    required={false}
                    value={sortItemValue}
                    onChange={setSortItemValue}
                />
                <ActionIcon
                    size={36}
                    data-test="table-sort-order"
                    title={`sort order is ${sortOrder === 'desc' ? 'descendant' : 'ascendant'}`}
                    onClick={() => {
                        toggleSortOrder();
                    }}
                >
                    {sortOrder === 'desc' ? <IconSortDescending stroke={1} /> : <IconSortAscending stroke={1} />}
                </ActionIcon>
            </Group>

            <Text pt="xl" weight={500}>Visible fields</Text>
            <Chip.Group
                align="self-start"
                p={8}
                value={visibleFields}
                onChange={setVisibleFields}
                multiple
            >
                {
                    Object.keys(adminLogsTableColumns).map((column) => (
                        <Chip
                            key={column}
                            value={column}
                            data-test={`settings-visible-columns-${adminLogsTableColumns[column].label}`}

                        >
                            {adminLogsTableColumns[column].label}
                        </Chip>
                    ))
                }
            </Chip.Group>
        </RelativeDrawer>
    );
}

export default TestsTableSettings;
