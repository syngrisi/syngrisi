import * as React from 'react';
import {
    ActionIcon,
    Chip,
    Group,
    SegmentedControl,
    Text,
} from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useInputState, useToggle, useLocalStorage } from '@mantine/hooks';
import { tableColumns } from './tableColumns';
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

function Settings(
    {
        open,
        setSortOpen,
        visibleFields,
        setVisibleFields,
        searchParams,
        setSearchParams,
    }: Props,
) {
    const [checksViewMode, setChecksViewMode] = useLocalStorage({ key: 'check-view-mode', defaultValue: 'bounded' });
    const [checksViewSize, setChecksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });

    const [sortOrder, toggleSortOrder] = useToggle(['desc', 'asc']);
    const [selectOptionsData] = useState(() => Object.keys(tableColumns)
        .map((column) => ({ value: column, label: tableColumns[column].label })));

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
                    Object.keys(tableColumns).map((column) => (
                        <Chip
                            key={column}
                            value={column}
                            data-test={`settings-visible-columns-${tableColumns[column].label}`}

                        >
                            {tableColumns[column].label}
                        </Chip>
                    ))
                }
            </Chip.Group>

            <Text mt="md" weight={500} pb="xs">Appearance of Checks</Text>
            <Group position="center">
                <SegmentedControl
                    data={['bounded', 'normal', 'list']}
                    value={checksViewMode}
                    onChange={setChecksViewMode}
                />
            </Group>
            <Group position="center" mt="md">
                <SegmentedControl
                    data={['small', 'medium', 'large', 'xlarge']}
                    value={checksViewSize}
                    onChange={setChecksViewSize}
                />
            </Group>

        </RelativeDrawer>
    );
}

export default Settings;
