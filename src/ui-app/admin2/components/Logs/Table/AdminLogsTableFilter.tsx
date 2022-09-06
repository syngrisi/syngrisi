import * as React from 'react';
import {
    Button,
    Group,
    Text,
} from '@mantine/core';
import RelativeDrawer from '../../../../shared/components/RelativeDrawer';

interface Props {
    open: boolean
    setOpen: any
    searchParams: any
    setSearchParams: any
}

function AdminLogsTableFilter(
    {
        open,
        setOpen,
        searchParams,
        setSearchParams,
    }: Props,
) {
    return (
        <RelativeDrawer
            open={open}
            setOpen={setOpen}
            title="Filter"
            width={260}
        >

            <Text>!!!!</Text>

            <Group position="center">
                <Button>Apply</Button>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
            </Group>
        </RelativeDrawer>
    );
}

export default AdminLogsTableFilter;
