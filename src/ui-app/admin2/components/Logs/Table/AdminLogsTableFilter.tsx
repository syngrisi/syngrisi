/* eslint-disable dot-notation */
import * as React from 'react';
import {
    Box,
    Button,
    Group,
    ScrollArea,
    Stack,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import RelativeDrawer from '../../../../shared/components/RelativeDrawer';
import { adminLogsTableColumns } from './adminLogsTableColumns';
import LogicalGroup from '../../../../shared/components/filter/LogicalGroup';
import { SearchParams } from '../../../../shared/utils';

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
    const [groupsData, setGroupsData] = useState<{ [key: string]: any }>({
        // initialGroupKey: {},
    });

    const updateGroupsData = (key: string, value: any) => {
        setGroupsData((prev) => ({ ...prev, [key]: value }));
    };

    const removeGroupsData = (key: string) => {
        setGroupsData((prev) => {
            const { [key]: removed, ...rest } = prev;
            return rest;
        });
    };

    const [mainGroupData, setMainGroupData] = useState<{ [key: string]: any }>([]);

    const updateMainGroupData = (key: undefined, value: { [key: string]: { [key: string]: string } }) => {
        setMainGroupData(() => value);
    };

    const removeMainGroupData = () => {
        setMainGroupData({});
    };

    const resetGroupsData = () => setGroupsData(() => ({}));

    const resetFilter = () => {
        resetGroupsData();
        removeMainGroupData();
    };

    /**
     * Create a full filter pure js object, which starts with root filter group operator ($and|$or)
     * e.g.:
     *"$or":[{
     *         {"level":{"$eq":"info"}},
     *        "$and":[
     *           {"level":{"$eq":"debug"}},
     *           {"id":{"$eq":"6318c585c09a7de71e4dd543"}}
     *        ]
     * }]
     */
    const createFilterObject = () => {
        const filterValue = (x: { [key: string]: { [key: string]: string } }) => Object.values(Object.values(x)[0])[0];
        const mainGroupRootRules = Object.values(mainGroupData.rules).filter((x: any) => filterValue(x));
        const mainGroupRules = [
            ...mainGroupRootRules,
            ...Object.keys(groupsData).map(
                (groupKey) => {
                    const groupRules = Object.values(groupsData[groupKey]['rules']).filter((x: any) => filterValue(x));
                    if (groupRules.length < 1) return {};
                    return {
                        [groupsData[groupKey]['operator']]: groupRules,
                    };
                },
            ),
        ];
        if (mainGroupRules.length < 1) return {};
        return {
            [mainGroupData.operator]: mainGroupRules,
        };
    };

    const applyFilter = () => {
        SearchParams.changeFiltering(searchParams, setSearchParams, JSON.stringify(createFilterObject()));
    };

    /* eslint-disable indent, react/jsx-indent */
    const groups = Object.keys(groupsData)
        .map(
            (key) => (
                <LogicalGroup
                    fields={adminLogsTableColumns}
                    updateGroupsData={updateGroupsData}
                    removeGroupsData={removeGroupsData}
                    key={key}
                    id={key}
                />
            ),
        );
    /* eslint-enable indent , react/jsx-indent */

    // eslint-disable-next-line prefer-arrow-callback
    useEffect(function groupsDataChange() {
    }, [JSON.stringify(groupsData)]);

    // eslint-disable-next-line prefer-arrow-callback
    useEffect(function mainGroupDataChange() {
        console.log('mainGroupDataChange');
        console.log({ mainGroupData });
    }, [JSON.stringify(mainGroupData)]);

    return (
        <RelativeDrawer
            open={open}
            setOpen={setOpen}
            title="Filter"
            width={560}
        >
            <ScrollArea.Autosize maxHeight="80vh" mr={-12} sx={{ height: '80vh' }}>
                <Box sx={{ paddingRight: 16, marginBottom: 100 }}>
                    <Stack>
                        <LogicalGroup
                            id="mainGroup"
                            fields={adminLogsTableColumns}
                            updateGroupsData={updateGroupsData}
                            updateMainGroupData={updateMainGroupData}
                            removeGroupsData={removeMainGroupData}
                        >
                            {groups}
                        </LogicalGroup>
                    </Stack>

                    <Group mt={24} position="right">
                        <Button onClick={() => resetFilter()} variant="light" color="red">Reset</Button>
                        <Button variant="light" color="gray" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={() => {
                            applyFilter();
                        }}
                        >
                            Apply
                        </Button>
                    </Group>
                </Box>
            </ScrollArea.Autosize>
        </RelativeDrawer>
    );
}

export default AdminLogsTableFilter;
