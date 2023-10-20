/* eslint-disable react/jsx-props-no-spreading,react-hooks/exhaustive-deps */
import * as React from 'react';
import { CommonDistinctFilter } from './CommonDistinctFilter';

interface Props {
    label: string
    updateGroupRules: any
    id: string
}

export function AcceptedFilter({ label, updateGroupRules, id }: Props) {
    return (
        <CommonDistinctFilter
            label={label}
            updateGroupRules={updateGroupRules}
            id={id}
            resource="test-distinct/markedAs"
        />
    );
}
