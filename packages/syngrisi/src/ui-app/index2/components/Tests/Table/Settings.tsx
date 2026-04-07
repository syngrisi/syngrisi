import * as React from 'react';
import {
    ActionIcon,
    Box,
    Chip,
    Group,
    SegmentedControl,
    Text,
} from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useInputState, useToggle, useLocalStorage } from '@mantine/hooks';
import { tableColumns } from '@index/components/Tests/Table/tableColumns';
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

    const segmentedControlStyles = {
        root: {
            backgroundColor: '#f1f3f5',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            padding: '4px',
            fontSize: '14px',
            lineHeight: '21.7px',
        },
        control: {
            fontSize: '14px',
            lineHeight: '21.7px',
        },
        indicator: {
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
        },
        label: {
            fontSize: '14px',
            lineHeight: '21.7px',
            padding: '4px 10px',
            color: '#495057',
        },
        innerLabel: {
            fontSize: '14px',
            lineHeight: '21.7px',
        },
    };

    useEffect(() => {
        SearchParams.changeSorting(searchParams, setSearchParams, sortItemValue, sortOrder);
    }, [sortItemValue, sortOrder]);

    return (
        <RelativeDrawer
            open={open}
            setOpen={setSortOpen}
            title="Settings"
            width={300}
            exactWidth
            padding={16}
        >
            <Group align="end" gap="sm" wrap="nowrap">
                <SafeSelect
                    label="Sort by"
                    data-test="table-sort-by-select"
                    aria-label="Sort by"
                    style={{ width: 198 }}
                    styles={{
                        label: {
                            fontSize: 14,
                            lineHeight: '21.7px',
                            marginBottom: 6,
                            fontWeight: 400,
                        },
                        input: {
                            fontSize: 14,
                        },
                    }}
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
                    variant="transparent"
                    color="gray"
                    style={{ fontSize: 24, lineHeight: '24px' }}
                    styles={{ icon: { width: 24, height: 24 } }}
                    onClick={() => {
                        toggleSortOrder();
                    }}
                >
                    {sortOrder === 'desc' ? <IconSortDescending stroke={1} size={24} /> : <IconSortAscending stroke={1} size={24} />}
                </ActionIcon>
            </Group>

            <Text pt="xl" fw={500} style={{ fontSize: 14, lineHeight: '21.7px' }}>Visible fields</Text>
            <Chip.Group
                value={visibleFields}
                onChange={setVisibleFields}
                multiple
            >
                <Box
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        gap: 6,
                        paddingTop: 8,
                        paddingBottom: 8,
                    }}
                >
                    {
                        Object.keys(tableColumns).map((column) => (
                            <Chip
                                key={column}
                                value={column}
                                data-test={`settings-visible-columns-${tableColumns[column].label}`}
                                aria-label={`Toggle ${tableColumns[column].label} column visibility`}
                                color="green"
                                radius="xl"
                                variant="outline"
                                styles={{
                                    root: {
                                        borderColor: '#ced4da',
                                        backgroundColor: '#ffffff',
                                        marginRight: 0,
                                        marginBottom: 0,
                                    },
                                    iconWrapper: {
                                        color: '#40c057',
                                    },
                                    label: {
                                        fontSize: '13px',
                                        paddingTop: 6,
                                        paddingBottom: 6,
                                    },
                                }}
                                size="sm"
                            >
                                {tableColumns[column].label}
                            </Chip>
                        ))
                    }
                </Box>
            </Chip.Group>

            <Text mt="md" fw={500} pb="xs" style={{ fontSize: 14, lineHeight: '21.7px' }}>Appearance of Checks</Text>
            <Group justify="center" mt={2}>
                <SegmentedControl
                    data-test="preview-mode-segment-control"
                    data={['bounded', 'normal', 'list']}
                    value={checksViewMode}
                    onChange={setChecksViewMode}
                    radius="xs"
                    style={{ width: 194 }}
                    styles={segmentedControlStyles}
                />
            </Group>
            <Group justify="center" mt={10}>
                <SegmentedControl
                    data-test="preview-size-segment-control"
                    data={['small', 'medium', 'large', 'xlarge']}
                    value={checksViewSize}
                    onChange={setChecksViewSize}
                    radius="xs"
                    style={{ width: 252 }}
                    styles={segmentedControlStyles}
                />
            </Group>

        </RelativeDrawer>
    );
}

export default Settings;
