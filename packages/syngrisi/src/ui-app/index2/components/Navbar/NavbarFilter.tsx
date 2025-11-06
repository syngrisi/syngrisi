/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { ActionIcon, FocusTrap, Loader, TextInput, Transition } from '@mantine/core';
import { IconX } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { escapeRegExp } from '../../../shared/utils/utils';

const quickFilterKey = (value: string) => {
    const transform = {
        runs: 'name',
        suites: 'name',
        'test-distinct/browserName': 'browserName',
        'test-distinct/os': 'os',
        'test-distinct/status': 'status',
        'test-distinct/markedAs': 'markedAs',
    } as { [key: string]: string };
    return transform[value] || 'name';
};

type Props = {
    openedFilter: boolean,
    infinityQuery: any,
    toggleOpenedFilter: any,
    setQuickFilterObject: any,
    groupByValue: string,
};

export function NavbarFilter(
    {
        openedFilter,
        infinityQuery,
        toggleOpenedFilter,
        setQuickFilterObject,
        groupByValue,
    }: Props,
) {
    const [quickFilter, setQuickFilter] = useState<string>('');
    const [debouncedQuickFilter] = useDebouncedValue(quickFilter, 400);

    useEffect(function onDebounceQuickFilterUpdate() {
        if (!debouncedQuickFilter) {
            setQuickFilterObject({});
        } else {
            setQuickFilterObject(() => (
                {
                    [quickFilterKey(groupByValue)]: {
                        $regex: escapeRegExp(debouncedQuickFilter),
                        $options: 'im',
                    },
                }
            ));
        }
    }, [debouncedQuickFilter]);

    return (
        <Transition
            mounted={openedFilter}
            transition="fade"
            duration={400}
            timingFunction="ease"
        >
            {(styles) => (
                <FocusTrap active>
                    <TextInput
                        label="Filter by"
                        data-test="navbar-quick-filter"
                        style={styles}
                        sx={{ width: '100%' }}
                        placeholder="Filter"
                        value={quickFilter}
                        onChange={(e) => {
                            setQuickFilter(e.currentTarget.value);
                        }}
                        rightSection={
                            (
                                (quickFilter === debouncedQuickFilter)
                                && !infinityQuery.isFetching
                            )
                                ? (
                                    <ActionIcon onClick={() => {
                                        if (quickFilter === '') toggleOpenedFilter(false);
                                        setQuickFilter('');
                                    }}
                                    >
                                        <IconX stroke={1} />
                                    </ActionIcon>
                                )
                                : (<Loader size={24} />)
                        }
                    />
                </FocusTrap>
            )}
        </Transition>
    );
}
