/* eslint-disable no-restricted-syntax,react/jsx-one-expression-per-line,react/jsx-props-no-spreading */
import * as React from 'react';
import { RingProgress, Tooltip, Text } from '@mantine/core';

interface IStatusesObj {
    group: { [key: string]: number } | []
    count: number
}

const createStatusesObj = (arr: string[]): IStatusesObj => {
    if (arr.length < 1) return { group: [], count: 0 };
    const group: { [key: string]: number } = {};

    for (const element of arr) {
        if (group[element.toLowerCase()]) {
            group[element.toLowerCase()] += 1;
        } else {
            group[element.toLowerCase()] = 1;
        }
    }
    return { group, count: arr.length };
};

interface Props {
    statuses: string[],
    ml: any,
}

export function StatusesRing({ statuses, ...rest }: Props) {
    const statusesObject: any = createStatusesObj(statuses);
    const ringSectionsData = statusesObject.count > 0
        ? [
            { value: (statusesObject.group.passed / statusesObject.count) * 100 || 0, color: 'green.7' },
            { value: (statusesObject.group.failed / statusesObject.count) * 100 || 0, color: 'red.7' },
            { value: (statusesObject.group.new / statusesObject.count) * 100 || 0, color: 'blue.7' },
            { value: (statusesObject.group.running / statusesObject.count) * 100 || 0, color: 'grape.6' },
            // {
            //     // eslint-disable-next-line max-len
            //     value: ((statusesObject.count - statusesObject.group.Failed + statusesObject.group.Passed + statusesObject.group.New)
            //         / statusesObject.count) * 100 || 0,
            //     color: 'gray',
            // },
        ]
        : [];

    const tooltipLabel = (
        <>
            {statusesObject.group.new && (<Text color="blue">New: {statusesObject.group.new}</Text>)}
            {statusesObject.group.passed && (<Text color="green">Passed: {statusesObject.group.passed}</Text>)}
            {statusesObject.group.failed && (<Text color="red">Failed: {statusesObject.group.failed}</Text>)}
            {statusesObject.group.running && (<Text color="grape.6">Running: {statusesObject.group.running}</Text>)}
        </>
    );

    return (
        <Tooltip label={tooltipLabel} withinPortal>
            <RingProgress
                sections={ringSectionsData}
                size={48}
                {...rest}
            />
        </Tooltip>
    );
}
