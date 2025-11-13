/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { ActionIcon, Group, Transition, useMantineTheme } from '@mantine/core';
import { IconSortAscending, IconSortDescending, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import SafeSelect from '../../../shared/components/SafeSelect';
import { useParams } from '../../hooks/useParams';

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
    openedSort: any,
    toggleOpenedSort: any,
};

export function NavbarSort(
    {
        groupBy,
        toggleOpenedSort,
        openedSort,
    }: Props,
) {
    const { query, setQuery } = useParams();
    const theme = useMantineTheme();
    const [sortBy, setSortBy] = useState(
        String(query.sortByNavbar).split(':').length > 1
            ? String(query.sortByNavbar).split(':')[0]
            : 'createdDate',
    );

    const [sortOrder, setSortOrder] = useState(
        String(query.sortByNavbar).split(':').length > 1
            ? String(query.sortByNavbar).split(':')[1]
            : 'desc',
    );

    useEffect(function sortUpdate() {
        setQuery({ sortByNavbar: `${sortBy}:${sortOrder}` });
    }, [`${sortBy}:${sortOrder}`]);

    return (
        <Transition
            mounted={openedSort}
            transition="fade"
            duration={400}
            timingFunction="ease"
        >
            {(styles) => (
                <Group align="end" position="apart" noWrap sx={{ width: '100%' }} style={styles}>
                    <SafeSelect
                        label="Sort by"
                        data-test="navbar-sort-by-select"
                        aria-label="Sort by"
                        sx={{ minWidth: '230px', marginTop: theme.spacing.md }}
                        value={sortBy}
                        onChange={(value: string) => setSortBy(() => value)}
                        optionsData={sortOptionsData(groupBy)}
                    />
                    <Group spacing={6} position="right">
                        <ActionIcon
                            title="Sort Order"
                            aria-label="Sort Order"
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
