import * as React from 'react';
import { ActionIcon, Group, Transition } from '@mantine/core';
import { IconSortAscending, IconSortDescending, IconX } from '@tabler/icons';
import SafeSelect from '../../../shared/components/SafeSelect';

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

type Props = {
    groupBy: string,
    setSortBy: any,
    sortBy: string,
    setSortOrder: any,
    sortOrder: string,
    openedSort: any,
    toggleOpenedSort: any,
};

export function NavbarSort(
    {
        groupBy,
        sortBy,
        setSortBy,
        setSortOrder,
        toggleOpenedSort,
        sortOrder,
        openedSort,
    }: Props,
) {
    return (
        <Transition
            mounted={openedSort}
            transition="fade"
            duration={400}
            timingFunction="ease"
        >
            {(styles) => (
                <Group align="end" noWrap style={styles}>
                    <SafeSelect
                        label="Sort by"
                        data-test="navbar-sort-by-select"
                        sx={{ width: '230px' }}
                        value={sortBy}
                        onChange={(value: string) => setSortBy(() => value)}
                        optionsData={sortOptionsData(groupBy)}
                    />
                    <Group spacing={6} position="right">
                        <ActionIcon
                            title="Sort Order"
                            data-test="navbar-sort-by-order"
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
                        <ActionIcon
                            mb={4}
                            onClick={() => toggleOpenedSort()}
                        >
                            <IconX stroke={1} />
                        </ActionIcon>
                    </Group>
                </Group>
            )}
        </Transition>
    );
}
