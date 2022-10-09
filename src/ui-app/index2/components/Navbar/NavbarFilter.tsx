import * as React from 'react';
import { ActionIcon, FocusTrap, Loader, TextInput, Transition } from '@mantine/core';
import { IconX } from '@tabler/icons';

type Props = {
    openedFilter: boolean,
    quickFilter: string,
    setQuickFilter: any,
    debouncedQuickFilter: any,
    infinityQuery: any,
    toggleOpenedFilter: any,
};

export function NavbarFilter(
    {
        openedFilter,
        quickFilter,
        setQuickFilter,
        debouncedQuickFilter,
        infinityQuery,
        toggleOpenedFilter,
    }: Props,
) {
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
