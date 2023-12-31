/* eslint-disable indent,react/jsx-indent,prefer-arrow-callback */
import React, { useState, useRef, useEffect } from 'react';
import {
    createStyles,
    Table,
    ScrollArea,
    Text,
} from '@mantine/core';

import InfinityScrollSkeleton from './InfinityScrollSkeleton';
import PagesCountAffix from './PagesCountAffix';
import ILog from '../../../../shared/interfaces/ILog';
import { testsCreateStyle } from './testsCreateStyle';
import Rows from './Rows';
import Heads from './Heads';
import { CheckModal } from './Checks/CheckModal';
import RemoveTestsButton from './RemoveTestsButton';
import AcceptTestsButton from './AcceptTestsButton';
import { useParams } from '../../../hooks/useParams';

const useStyles = createStyles(testsCreateStyle as any);

interface Props {
    infinityQuery: any
    firstPageQuery: any,
    visibleFields: any
    updateToolbar: any
    size?: string
}

export default function TestsTable(
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

    // eslint-disable-next-line no-unused-vars
    const { classes } = useStyles();
    const [selection, setSelection]: [string[], any] = useState([]);

    useEffect(function resetSelection() {
        setSelection(() => ([]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(query.base_filter), query.app]);

    const scrollAreaRef = useRef(null);
    // eslint-disable-next-line max-len
    const toggleAllRows = () => setSelection((current: string) => (current.length === flatData.length ? [] : flatData.map((item: ILog) => item.id)));

    useEffect(function onSelectionUpdate() {
        updateToolbar(
            <RemoveTestsButton
                selection={selection}
                setSelection={setSelection}
                infinityQuery={infinityQuery}
            />,
            31,
        );
        updateToolbar(
            <AcceptTestsButton
                selection={selection}
                setSelection={setSelection}
                infinityQuery={infinityQuery}
                // firstPageQuery={firstPageQuery}
            />,
            32,
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
                    // mb={100}
                    verticalSpacing="sm"
                    highlightOnHover
                >
                    <thead
                        style={{ zIndex: 10 }}
                        className={classes.header}
                    >
                    <Heads
                        data={data}
                        toggleAllRows={toggleAllRows}
                        selection={selection}
                        visibleFields={visibleFields}
                    />
                    </thead>

                    {
                        // eslint-disable-next-line no-nested-ternary
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
                                    <Rows
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
            <CheckModal firstPageQuery={firstPageQuery} />
        </>
    );
}
