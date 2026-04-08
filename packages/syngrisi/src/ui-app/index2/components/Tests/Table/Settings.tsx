import * as React from 'react';
import {
    ActionIcon,
    Box,
    Chip,
    Group,
    SegmentedControl,
    Text,
    useComputedColorScheme,
    useMantineTheme,
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
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();
    const [checksViewMode, setChecksViewMode] = useLocalStorage({ key: 'check-view-mode', defaultValue: 'bounded' });
    const [checksViewSize, setChecksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });

    const [sortOrder, toggleSortOrder] = useToggle(['desc', 'asc']);
    const [selectOptionsData] = useState(() => Object.keys(tableColumns)
        .map((column) => ({ value: column, label: tableColumns[column].label })));

    const [sortItemValue, setSortItemValue] = useInputState('startDate');

    const segmentedControlStyles = {
        root: {
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : '#f1f3f5',
            border: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[4] : '#dee2e6'}`,
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
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[5] : '#ffffff',
            boxShadow: colorScheme === 'dark' ? 'none' : '0 1px 1px rgba(0, 0, 0, 0.06)',
            border: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[3] : '#dee2e6'}`,
            borderRadius: '4px',
        },
        label: {
            fontSize: '14px',
            lineHeight: '21.7px',
            padding: '4px 10px',
            color: colorScheme === 'dark' ? theme.colors.gray[3] : '#495057',
        },
        innerLabel: {
            fontSize: '14px',
            lineHeight: '21.7px',
        },
    };

    const visibleFieldChipStyles = {
        label: {
            fontSize: '13px',
            paddingTop: 6,
            paddingBottom: 6,
        },
    };

    const settingsCss = `
        [data-test="preview-mode-segment-control"],
        [data-test="preview-size-segment-control"] {
            background-color: ${colorScheme === 'dark' ? theme.colors.dark[6] : '#f1f3f5'} !important;
            border: 1px solid ${colorScheme === 'dark' ? theme.colors.dark[4] : '#dee2e6'} !important;
        }

        [data-test="preview-mode-segment-control"] .mantine-SegmentedControl-indicator,
        [data-test="preview-size-segment-control"] .mantine-SegmentedControl-indicator {
            background-color: ${colorScheme === 'dark' ? theme.colors.dark[5] : '#ffffff'} !important;
            border: 1px solid ${colorScheme === 'dark' ? theme.colors.dark[3] : '#dee2e6'} !important;
            box-shadow: ${colorScheme === 'dark' ? 'none' : '0 1px 1px rgba(0, 0, 0, 0.06)'} !important;
        }

        [data-test="preview-mode-segment-control"] .mantine-SegmentedControl-label,
        [data-test="preview-size-segment-control"] .mantine-SegmentedControl-label {
            color: ${colorScheme === 'dark' ? theme.colors.gray[3] : '#495057'} !important;
        }

        [data-test^="settings-visible-columns-"] + .mantine-Chip-label {
            border: 1px solid ${colorScheme === 'dark' ? theme.colors.dark[3] : '#ced4da'} !important;
            background-color: ${colorScheme === 'dark' ? theme.colors.dark[6] : '#ffffff'} !important;
            color: ${colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.dark[6]} !important;
        }

        [data-test^="settings-visible-columns-"] + .mantine-Chip-label .mantine-Chip-iconWrapper {
            color: ${theme.colors.green[5]} !important;
        }

        [data-test^="settings-visible-columns-"]:checked + .mantine-Chip-label,
        [data-test^="settings-visible-columns-"] + .mantine-Chip-label[data-checked="true"] {
            border-color: ${theme.colors.green[5]} !important;
            background-color: ${colorScheme === 'dark' ? 'rgba(64, 192, 87, 0.14)' : '#ffffff'} !important;
            color: ${colorScheme === 'dark' ? theme.white : theme.colors.dark[6]} !important;
        }
    `;

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
            <style>{settingsCss}</style>
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
                                styles={visibleFieldChipStyles}
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
