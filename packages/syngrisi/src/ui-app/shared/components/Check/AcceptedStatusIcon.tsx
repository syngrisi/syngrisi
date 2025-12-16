/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { RingProgress } from '@mantine/core';

interface Props {
    status: string
    size: number
}

const iconMap = ({ key, size = 44, rest }: { key: string, size: number, rest: any }) => {
    const map = {
        Accepted: (
            <RingProgress
                size={size}
                sections={[
                    { value: 100, color: 'green' },
                ]}
            />
        ),
        Partially: (
            <RingProgress
                size={size}
                sections={[
                    { value: 100, color: 'orange' },
                ]}
            />
        ),
        Unaccepted: (
            <RingProgress
                size={size}
                sections={[
                    { value: 100, color: 'red' },
                ]}
            />
        ),
    } as { [key: string]: any };
    return map[key] || (
        <RingProgress
            title={key}
            size={size}
            sections={
                [{ value: 100, color: 'dark.4' }]
            }
            {...rest}
        />
    );
};

export function AcceptedStatusIcon({ status, size, ...rest }: Props) {
    return iconMap({ key: status, size, rest });
}
