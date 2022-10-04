import * as React from 'react';
import { ActionIcon, Group, Popover } from '@mantine/core';
import { IconArrowsSort, IconSortAscending, IconSortDescending, IconX } from '@tabler/icons';
import SafeSelect from '../../../shared/components/SafeSelect';

type Props = {
    groupBy: string,
    sortOpened: any,
    setSortOpened: any,
    setSortBy: any,
    sortBy: string,
    setSortOrder: any,
    sortOrder: string,
};

const sortOptionsData = (type: string) => {
    const transform = {
        runs: [
            { value: 'createdDate', label: 'Created Date' },
            { value: 'name', label: 'Name' },
        ],
        suites: [
            { value: 'createdDate', label: 'Created Date' },
            { value: 'name', label: 'Name' },
        ],
    };
    return transform[type as keyof typeof transform] || [
        { value: '_id', label: 'Name' },
    ];
};

export function SortPopover(
    {
        groupBy,
        sortOpened,
        setSortOpened,
        sortBy,
        setSortBy,
        setSortOrder,
        sortOrder,
    }: Props,
) {
    return (
        <Popover opened={sortOpened} onChange={setSortOpened} shadow="md" position="bottom-end">
            <Popover.Target>
                <ActionIcon
                    title="Sorting"
                    mb={4}
                    onClick={() => setSortOpened((o) => !o)}
                >
                    <IconArrowsSort stroke={1} />
                </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
                <Group position="right" align="start" sx={{ width: '100%' }} noWrap>
                    <ActionIcon size="sm" mr={-10} mt={-4} onClick={() => setSortOpened(false)}>
                        <IconX stroke={1} size={16} />
                    </ActionIcon>
                </Group>

                <Group align="end" noWrap>
                    <SafeSelect
                        label="Sort by"
                        data-test="navbar-sort-by-select"
                        sx={{ width: '230px' }}
                        value={sortBy}
                        onChange={(value: string) => setSortBy(() => value)}
                        optionsData={sortOptionsData(groupBy)}
                    />
                    <ActionIcon
                        title="Sort Order"
                        mb={4}
                        onClick={
                            () => {
                                if (sortOrder === 'asc') {
                                    setSortOrder('desc');
                                    return;
                                }
                                setSortOrder('asc');
                            }
                        }
                    >
                        {
                            (sortOrder === 'asc')
                                ? <IconSortAscending stroke={1} />
                                : <IconSortDescending stroke={1} />
                        }
                    </ActionIcon>
                </Group>
            </Popover.Dropdown>
        </Popover>

    );
}
