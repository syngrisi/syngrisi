import * as React from 'react';
import {
    ActionIcon,
    Chip,
    Group,
    SegmentedControl,
    Text,
} from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useInputState, useToggle, useLocalStorage } from '@mantine/hooks';
import { baselinesTableColumns } from './baselinesTableColumns';
import RelativeDrawer from '@shared/components/RelativeDrawer';
import SafeSelect from '@shared/components/SafeSelect';
import { SearchParams } from '@shared/utils';

interface Props {
    open: boolean
    setSortOpen: any,
    visibleFields: any
    setVisibleFields: any
    searchParams: any
    setSearchParams: any
}

function BaselinesSettings(
    {
        open,
        setSortOpen,
        visibleFields,
        setVisibleFields,
        searchParams,
        setSearchParams,
    }: Props,
) {
    const [checksViewMode, setChecksViewMode] = useLocalStorage({ key: 'baselines-view-mode', defaultValue: 'bounded' });
    const [checksViewSize, setChecksViewSize] = useLocalStorage({ key: 'baselines-view-size', defaultValue: 'medium' });

    const [sortOrder, toggleSortOrder] = useToggle(['desc', 'asc']);
    
    const sortableColumns = ['name', 'branch', 'createdDate', 'browserName', 'viewport', 'os', 'markedAs'];
    const [selectOptionsData] = useState(() => Object.keys(baselinesTableColumns)
        .filter(column => sortableColumns.includes(column))
        .map((column) => ({ value: column, label: baselinesTableColumns[column].label })));

    const [sortItemValue, setSortItemValue] = useInputState('createdDate');

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
                    aria-label="Sort by"
                    optionsData={selectOptionsData}
                    required={false}
                    value={sortItemValue}
                    onChange={setSortItemValue}
                />
                <ActionIcon
                    size={36}
                    data-test="table-sort-order"
                    aria-label={`sort order is ${sortOrder === 'desc' ? 'descendant' : 'ascendant'}`}
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
                    Object.keys(baselinesTableColumns).map((column) => (
                        <Chip
                            key={column}
                            value={column}
                            data-test={`settings-visible-columns-${baselinesTableColumns[column].label}`}
                            aria-label={`Toggle ${baselinesTableColumns[column].label} column visibility`}
                        >
                            {baselinesTableColumns[column].label}
                        </Chip>
                    ))
                }
            </Chip.Group>

            <Text mt="md" weight={500} pb="xs">Appearance of Baselines</Text>
            <Group position="center">
                <SegmentedControl
                    data-test="preview-mode-segment-control"
                    data={['bounded', 'normal', 'list']}
                    value={checksViewMode}
                    onChange={setChecksViewMode}
                />
            </Group>
            <Group position="center" mt="md">
                <SegmentedControl
                    data-test="preview-size-segment-control"
                    data={['small', 'medium', 'large', 'xlarge']}
                    value={checksViewSize}
                    onChange={setChecksViewSize}
                />
            </Group>

        </RelativeDrawer>
    );
}

export default BaselinesSettings;
