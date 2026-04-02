/* eslint-disable indent,react/jsx-indent */
import React, { useState, useRef } from 'react';
import {
    Table,
    ScrollArea,
    useMantineTheme,
    useComputedColorScheme,
} from '@mantine/core';

import InfinityScrollSkeleton from '@admin/components/Logs/Table/InfinityScrollSkeleton';
import PagesCountAffix from '@admin/components/Logs/Table/PagesCountAffix';
import ILog from '@shared/interfaces/ILog';
import { getAdminLogsStyles } from '@admin/components/Logs/Table/adminLogsCreateStyle';
import AdminLogsTableRows from '@admin/components/Logs/Table/AdminLogsTableRows';
import AdminLogsTableHeads from '@admin/components/Logs/Table/AdminLogsTableHeads';

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

    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme('light');
    const styles = getAdminLogsStyles(theme, colorScheme);

    // eslint-disable-next-line no-unused-vars
    const [scrolled, setScrolled] = useState(false);
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
                style={{ width: '100%', paddingBottom: 115 }}
                styles={{ scrollbar: { marginTop: '46px' } }}
            >

                <Table style={{ width: '100%', paddingBottom: 500 }} verticalSpacing="sm" highlightOnHover>
                    <thead
                        style={{
                            zIndex: 15,
                            ...styles.header,
                            ...(scrolled ? styles.scrolled : {}),
                        }}
                    >
                    <AdminLogsTableHeads
                        data={data}
                        toggleAllRows={toggleAllRows}
                        selection={selection}
                        visibleFields={visibleFields}
                    />

                    </thead>
                    <tbody style={styles.tableBody}>
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
