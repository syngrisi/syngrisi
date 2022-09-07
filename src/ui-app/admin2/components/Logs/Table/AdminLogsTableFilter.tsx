import * as React from 'react';
import {
    Button,
    Group,
} from '@mantine/core';
import RelativeDrawer from '../../../../shared/components/RelativeDrawer';
import { adminLogsTableColumns } from './adminLogsTableColumns';
import LogicalGroup from '../../../../shared/components/filter/LogicalGroup';

interface Props {
    open: boolean
    setOpen: any
    searchParams: any
    setSearchParams: any
    filterObject: { [key: string]: any }
    updateFilterObject: any
}

function AdminLogsTableFilter(
    {
        open,
        setOpen,
        searchParams,
        setSearchParams,
        filterObject,
        updateFilterObject,
        fields,
    }: Props,
) {
    return (
        <RelativeDrawer
            open={open}
            setOpen={setOpen}
            title="Filter"
            width={560}
        >
            <Group mt={24} position="center" noWrap>
                <LogicalGroup fields={adminLogsTableColumns} />
            </Group>

            <Group mt={24}>
                <Button color="red">Reset</Button>
                <Button>Apply</Button>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
            </Group>
        </RelativeDrawer>
    );
}

export default AdminLogsTableFilter;
