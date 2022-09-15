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

function AdminLogsTableSettings(
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
        .map((item) => ({ value: item, label: item.charAt(0).toUpperCase() + item.slice(1) })));

    const [sortItemValue, setSortItemValue] = useInputState('timestamp');

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
                    data-test="user-add-role"
                    optionsData={selectOptionsData}
                    required={false}
                    value={sortItemValue}
                    onChange={setSortItemValue}
                />
                <ActionIcon
                    size={36}
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
                    Object.keys(adminLogsTableColumns).map((field) => (
                        <Chip key={field} value={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Chip>
                    ))
                }
            </Chip.Group>
        </RelativeDrawer>
    );
}

export default AdminLogsTableSettings;
