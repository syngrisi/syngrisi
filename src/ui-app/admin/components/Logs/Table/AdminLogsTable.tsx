/* eslint-disable */
import React, { useContext, useState } from 'react';
import {
    createStyles,
    Table,
    ScrollArea,
} from '@mantine/core';

import InfinityScrollSkeleton from './InfinityScrollSkeleton';
import { useRef } from 'react';
import PagesCountAffix from './PagesCountAffix';
import ILog from '../../../../shared/interfaces/ILog';
import { AppContext } from '../../../AppContext';
import { adminLogsCreateStyle } from './adminLogsCreateStyle';
import AdminLogsTableRows from './AdminLogsTableRows';
import AdminLogsTableHeads from './AdminLogsTableHeads';

const useStyles = createStyles(adminLogsCreateStyle as any);

interface TableSelectionProps {
    data: { id: string; hostname: string; level: string; message: string; timestamp: string }[];
}

interface Props {
    infinityQuery: any
    visibleFields: any
}

export default function AdminLogsTable({ infinityQuery, visibleFields }: any) {
    const data = infinityQuery.data;
    const flatData = data.pages.flat().map((x: any) => x.results).flat();

    const [scrolled, setScrolled] = useState(false);
    const { classes, cx } = useStyles();
    const [selection, setSelection]: [string[], any] = useState([]);
    const scrollAreaRef = useRef(null);
    const { updateToolbar }: any = useContext(AppContext);
    const toggleAllRows = () =>
        setSelection((current: string) => (current.length === flatData.length ? [] : flatData.map((item: ILog) => item.id)));

    return (
        <>
            <ScrollArea.Autosize
                data-test="table-scroll-area"
                ref={scrollAreaRef}
                maxHeight={'100vh'}
                sx={{ width: '100%' }}
                styles={{ scrollbar: { marginTop: '46px' } }}
            >

                <Table sx={{ width: '100%' }} verticalSpacing="sm" highlightOnHover>
                    <thead style={{ zIndex: 100 }}
                           className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                    <AdminLogsTableHeads
                        data={data}
                        toggleAllRows={toggleAllRows}
                        selection={selection}
                        visibleFields={visibleFields}
                    />

                    </thead>
                    <tbody className={classes.tableBody}>
                    <AdminLogsTableRows
                        data={data}
                        selection={selection}
                        setSelection={setSelection}
                        visibleFields={visibleFields}
                    />
                    </tbody>
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
