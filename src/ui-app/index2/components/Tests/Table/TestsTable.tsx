/* eslint-disable indent,react/jsx-indent,prefer-arrow-callback */
import React, { useState, useRef, useEffect, useContext } from 'react';
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
import { AppContext } from '../../../AppContext';

const useStyles = createStyles(testsCreateStyle as any);

interface Props {
    infinityQuery: any
    firstPageQuery: any,
    visibleFields: any
    size?: string
}

export default function TestsTable({ infinityQuery, firstPageQuery, visibleFields, size = '100%' }: Props) {
    const { updateToolbar }: any = useContext(AppContext);
    const { data } = infinityQuery;
    const flatData = data ? data.pages.flat().map((x: any) => x.results).flat() : [];

    // eslint-disable-next-line no-unused-vars
    const [scrolled, setScrolled] = useState(false);
    const { classes, cx } = useStyles();
    const [selection, setSelection]: [string[], any] = useState([]);
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
                pb={24}
                styles={{ scrollbar: { marginTop: '46px' } }}
            >

                <Table sx={{ width: '100%' }} verticalSpacing="sm" highlightOnHover>
                    <thead
                        style={{ zIndex: 10 }}
                        className={cx(classes.header, { [classes.scrolled]: scrolled })}
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
