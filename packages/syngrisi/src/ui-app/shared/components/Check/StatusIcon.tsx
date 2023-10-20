/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { RingProgress } from '@mantine/core';

interface Props {
    status: string
    size: number
}

const iconMap = ({ key, size = 44, rest }: { key: string, size: number, rest: any }) => {
    const map = {
        new: (
            <RingProgress
                size={size}
                thickness={size / 3.14}
                sections={[
                    { value: 100, color: 'blue' },
                ]}
            />
        ),
        passed: (
            <RingProgress
                size={size}
                thickness={size / 3.14}
                sections={[
                    { value: 100, color: 'green' },
                ]}
            />
        ),
        failed: (
            <RingProgress
                size={size}
                thickness={size / 3.14}
                sections={[
                    { value: 100, color: 'red' },
                ]}
            />
        ),
        running: (
            <RingProgress
                size={size}
                thickness={size / 3.14}
                sections={[
                    { value: 100, color: 'gray' },
                ]}
            />
        ),

    } as { [key: string]: any };

    return map[(key || '').toLowerCase()] || (
        <RingProgress
            title={key}
            size={size}
            thickness={size / 3.14}
            sections={
                [{ value: 100, color: 'dark.4' }]
            }
            {...rest}
        />
    );
};

export function StatusIcon({ status, size, ...rest }: Props) {
    return iconMap({ key: status, size, rest });
}
