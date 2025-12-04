/* eslint-disable indent,react/jsx-indent */
import React, { useState, useRef } from 'react';
import {
    createStyles,
    Table,
    ScrollArea,
} from '@mantine/core';

import InfinityScrollSkeleton from '@admin/components/Logs/Table/InfinityScrollSkeleton';
import PagesCountAffix from '@admin/components/Logs/Table/PagesCountAffix';
import ILog from '@shared/interfaces/ILog';
import { adminLogsCreateStyle } from '@admin/components/Logs/Table/adminLogsCreateStyle';
import AdminLogsTableRows from '@admin/components/Logs/Table/AdminLogsTableRows';
import AdminLogsTableHeads from '@admin/components/Logs/Table/AdminLogsTableHeads';

const useStyles = createStyles(adminLogsCreateStyle as any);

// interface TableSelectionProps {
//     data: { id: string; hostname: string; level: string; message: string; timestamp: string }[];
// }

interface Props {
    infinityQuery: any
    visibleFields: any
}

export default function AdminLogsTable({ infinityQuery, visibleFields }: Props) {
    const { data } = infinityQuery;
    const flatData = data.pages.flat().map((x: any) => x.results).flat();

    // eslint-disable-next-line no-unused-vars
    const [scrolled, setScrolled] = useState(false);
    const { classes, cx } = useStyles();
    const [selection, setSelection]: [string[], any] = useState([]);
    const scrollAreaRef = useRef(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    // const { updateToolbar }: any = useContext(AppContext);
    const toggleAllRows = () => setSelection(
        (current: string) => (current.length === flatData.length ? [] : flatData.map((item: ILog) => item.id)),
    );
    return (
        <>
            <ScrollArea.Autosize
                data-test="table-scroll-area"
                ref={scrollAreaRef}
                viewportRef={viewportRef}
                maxHeight="100vh"
                sx={{ width: '100%', paddingBottom: 115 }}
                styles={{ scrollbar: { marginTop: '46px' } }}
            >

                <Table sx={{ width: '100%', paddingBottom: 500 }} verticalSpacing="sm" highlightOnHover>
                    <thead
                        style={{ zIndex: 15 }}
                        className={cx(classes.header, { [classes.scrolled]: scrolled })}
                    >
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
                    <InfinityScrollSkeleton infinityQuery={infinityQuery} visibleFields={visibleFields} scrollRootRef={viewportRef} />
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
