import * as React from 'react';
import { ActionIcon, Group, Transition } from '@mantine/core';
import { IconSortAscending, IconSortDescending, IconX } from '@tabler/icons';
import SafeSelect from '../../../../../../../shared/components/SafeSelect';

type Props = {
    setSortBy: any,
    sortBy: string,
    setSortOrder: any,
    sortOrder: string,
    openedSort: any,
    toggleOpenedSort: any,
};

export function RelatedCheckSort(
    {
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
                <Group align="end" spacing={4} pr={10} ml={-10} mr={-10} noWrap style={styles}>
                    <SafeSelect
                        label="Sort by"
                        data-test="navbar-sort-by-select"
                        // sx={{ width: '230px' }}
                        value={sortBy}
                        onChange={(value: string) => setSortBy(() => value)}
                        optionsData={
                            [
                                { value: 'createdDate', label: 'Created Date' },
                                { value: 'browserName', label: 'Browser' },
                                { value: 'os', label: 'Platform' },
                                { value: 'viewport', label: 'Viewport' },
                            ]
                        }
                    />
                    <Group spacing={2} position="right" noWrap>
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
