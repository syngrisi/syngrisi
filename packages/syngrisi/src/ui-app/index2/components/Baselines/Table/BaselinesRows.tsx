import React from 'react';
import { BaselinesRow } from './BaselinesRow';

interface Props {
    infinityQuery: any
    selection: any
    setSelection: any
    updateToolbar: any
    visibleFields: string[]
}

const BaselinesRows = ({ infinityQuery, selection, setSelection, visibleFields }: Props) => {
    const { data } = infinityQuery;

    const toggleRow = (id: string) => setSelection(
        (current: any) => (current.includes(id) ? current.filter((item: string) => item !== id) : [...current, id]),
    );

    return data.pages.map((page: any) => (
        page.results.map(
            (item: any, index: number) => (
                <BaselinesRow
                    key={item.id || item._id}
                    item={item}
                    toggleRow={toggleRow}
                    index={index}
                    visibleFields={visibleFields}
                    selection={selection}
                />
            ),
        )
    ));
};

export default BaselinesRows;
