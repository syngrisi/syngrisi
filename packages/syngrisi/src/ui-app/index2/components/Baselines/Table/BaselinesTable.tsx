/* eslint-disable indent,react/jsx-indent,prefer-arrow-callback */
import React, { useState, useRef, useEffect } from 'react';
import {
    createStyles,
    Table,
    ScrollArea,
    Text,
} from '@mantine/core';

import InfinityScrollSkeleton from '@index/components/Tests/Table/InfinityScrollSkeleton';
import PagesCountAffix from '@index/components/Tests/Table/PagesCountAffix';
import { testsCreateStyle } from '@index/components/Tests/Table/testsCreateStyle';
import BaselinesRows from './BaselinesRows';
import BaselinesHeads from './BaselinesHeads';
import RemoveBaselinesButton from './RemoveBaselinesButton';
import { useParams } from '@hooks/useParams';

const useStyles = createStyles(testsCreateStyle as any);

interface Props {
    infinityQuery: any
    firstPageQuery: any,
    visibleFields: any
    updateToolbar: any
    size?: string
}

export default function BaselinesTable(
    {
        infinityQuery,
        firstPageQuery,
        visibleFields,
        updateToolbar,
        size = '100%',
    }: Props,
) {
    const { query } = useParams();
    const { data } = infinityQuery;
    const flatData = data ? data.pages.flat().map((x: any) => x.results).flat() : [];

    const { classes } = useStyles();
    const [selection, setSelection]: [string[], any] = useState([]);

    useEffect(function resetSelection() {
        setSelection(() => ([]));
    }, [JSON.stringify(query.base_filter), query.app]);

    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const toggleAllRows = () => setSelection((current: string) => (current.length === flatData.length ? [] : flatData.map((item: any) => item.id || item._id)));

    useEffect(function onSelectionUpdate() {
        updateToolbar(
            <RemoveBaselinesButton
                selection={selection}
                setSelection={setSelection}
                infinityQuery={infinityQuery}
            />,
            31,
        );
    }, [selection.length]);

    return (
        <>
            <ScrollArea.Autosize
                data-test="table-scroll-area"
                ref={scrollAreaRef}
                maxHeight="100vh"
                sx={{ width: size }}
                pb={124}
                styles={{ scrollbar: { marginTop: '46px' } }}
            >

                <Table
                    sx={{ width: '100%' }}
                    verticalSpacing="sm"
                    highlightOnHover
                >
                    <thead
                        style={{ zIndex: 10 }}
                        className={classes.header}
                    >
                    <BaselinesHeads
                        flatData={flatData}
                        toggleAllRows={toggleAllRows}
                        selection={selection}
                        visibleFields={visibleFields}
                    />
                    </thead>

                    {
                        infinityQuery.isLoading
                            ? (<InfinityScrollSkeleton infinityQuery={null} visibleFields={visibleFields} />)
                            : infinityQuery.isError
                                ? (
                                    <Text color="red">
                                        Error:
                                        {infinityQuery.error.message}
                                    </Text>
                                )
                                : (
                                    <tbody className={classes.tableBody}>
                                    <BaselinesRows
                                        updateToolbar={updateToolbar}
                                        infinityQuery={infinityQuery}
                                        selection={selection}
                                        setSelection={setSelection}
                                        visibleFields={visibleFields}
                                    />
                                    </tbody>
                                )
                    }
                    <InfinityScrollSkeleton infinityQuery={infinityQuery} visibleFields={visibleFields} />
                </Table>
            </ScrollArea.Autosize>
            <PagesCountAffix
                loaded={infinityQuery.data?.pages?.length.toString()}
                total={infinityQuery.data?.pages && infinityQuery.data?.pages[0].totalPages}
                scrollAreaRef={scrollAreaRef}
            />
        </>
    );
}
