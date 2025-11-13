/* eslint-disable react/no-array-index-key */
import { Group, Progress } from '@mantine/core';
import * as React from 'react';
import requirements from '@auth/components/change-password/requirements';

export default function Bars({ value }: { value: string }) {
    function getStrength(password: string): number {
        let multiplier = password.length > 5 ? 0 : 1;

        requirements.forEach((requirement) => {
            if (!requirement.re.test(password)) {
                multiplier += 1;
            }
        });

        return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
    }

    const strength = getStrength(value);

    const bars = Array(4)
        .fill(0)
        .map((_, index) => (
            <Progress
                styles={{ bar: { transitionDuration: '0ms' } }}
                value={
                    (value.length > 0 && index === 0)
                        ? 100
                        : strength >= ((index + 1) / 4) * 100 ? 100 : 0
                }
                color={
                    strength > 80
                        ? 'teal'
                        : (strength > 50 ? 'yellow' : 'red')
                }
                key={index}
                size={4}
            />
        ));
    return (
        <Group spacing={5} grow mt="xs" mb="md">
            {bars}
        </Group>
    );
}
