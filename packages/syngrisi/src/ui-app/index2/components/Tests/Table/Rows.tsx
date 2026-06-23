/* eslint-disable react/jsx-one-expression-per-line */
import React, { useCallback, useEffect, useState } from 'react';
import UnfoldActionIcon from '@index/components/Tests/Table/UnfoldActionIcon';
import { Row } from '@index/components/Tests/Table/Row';
import { useParams } from '@hooks/useParams';
import { parseTriageFilter, testHasTriageMatch } from '@index/components/Tests/Table/triageFilter';

interface Props {
    infinityQuery: any
    selection: any
    setSelection: any
    updateToolbar: any
    visibleFields: string[]
}

const Rows = ({ infinityQuery, selection, setSelection, visibleFields, updateToolbar }: Props) => {
    const [collapse, setCollapse]: [string[], any] = useState([]);
    const { data } = infinityQuery;
    const { query } = useParams();
    // When an AI-triage filter is active, hide tests that have no matching check
    // (checks are populated on each test). Non-matching checks are hidden inside Checks.tsx.
    const triage = parseTriageFilter(query.checkFilter);

    const toggleCollapse = useCallback((id: string) => {
        setCollapse(
            (current: any) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]),
        );
    }, []);

    const expand = useCallback((id: string) => {
        setCollapse(
            (current: any) => {
                if (!current.includes(id)) {
                    return [...current, id];
                }
                return current;
            },
        );
    }, []);

    const fold = useCallback((id: string) => {
        setCollapse(
            (current: any) => {
                if (current.includes(id)) {
                    return current.filter((item: string) => item !== id);
                }
                return current;
            },
        );
    }, []);

    const expandSelected = useCallback(() => {
        selection.forEach((item: string) => expand(item));
    }, [selection, expand]);

    const collapseSelected = useCallback(() => {
        selection.forEach((item: string) => fold(item));
    }, [selection, fold]);

    useEffect(() => {
        updateToolbar(
            <UnfoldActionIcon
                mounted={selection.length > 0}
                expandSelected={expandSelected}
                collapseSelected={collapseSelected}
            />,
            30,
        );
    }, [selection.length]);

    const toggleRow = useCallback((id: string) => setSelection(
        (current: any) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]),
    ), [setSelection]);

    return data.pages.map((page: any) => (
        page.results
            .filter((item: any) => !triage.active || testHasTriageMatch(item, triage))
            .map(
            (item: any, index: number) => (
                <Row
                    key={item.id}
                    item={item}
                    infinityQuery={infinityQuery}
                    toggleRow={toggleRow}
                    toggleCollapse={toggleCollapse}
                    index={index}
                    visibleFields={visibleFields}
                    selection={selection}
                    collapse={collapse}
                />
            ),
        )
    ));
};

export default Rows;
