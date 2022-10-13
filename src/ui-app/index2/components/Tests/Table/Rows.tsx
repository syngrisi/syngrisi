/* eslint-disable react/jsx-one-expression-per-line */
import React, { useContext, useEffect, useState } from 'react';
import UnfoldActionIcon from '../UnfoldActionIcon';
import { AppContext } from '../../../AppContext';
import { Row } from './Row';

interface Props {
    data: any,
    selection: any,
    setSelection: any,
    visibleFields: string[]
}

const Rows = ({ data, selection, setSelection, visibleFields }: Props) => {
    const [collapse, setCollapse]: [string[], any] = useState([]);
    const { updateToolbar }: any = useContext(AppContext);

    const toggleCollapse = (id: string) => {
        setCollapse(
            (current: any) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]),
        );
    };

    const expand = (id: string) => {
        setCollapse(
            (current: any) => {
                if (!current.includes(id)) {
                    return [...current, id];
                }
                return current;
            },
        );
    };
    const fold = (id: string) => {
        setCollapse(
            (current: any) => {
                if (current.includes(id)) {
                    return current.filter((item: string) => item !== id);
                }
                return current;
            },
        );
    };

    const expandSelected = () => {
        selection.forEach((item: string) => expand(item));
    };

    const collapseSelected = () => {
        selection.forEach((item: string) => fold(item));
    };

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

    const toggleRow = (id: string) => setSelection(
        (current: any) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]),
    );

    return data.pages.map((page: any) => (
        page.results.map(
            (item: any, index: number) => (
                <Row
                    key={item.id}
                    item={item}
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
