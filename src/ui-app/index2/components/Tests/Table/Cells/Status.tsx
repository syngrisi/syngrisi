import * as React from 'react';
import { Group, Text, Tooltip } from '@mantine/core';
import { useMemo } from 'react';
import { tableColumns } from '../tableColumns';
import { StatusesRing } from '../../../../../shared/components/Tests/StatusesRing';

interface Props {
    type: string
    test: any
}

export function Status({ type, test }: Props) {
    const checkStatuses: string[] = useMemo(
        () => {
            if (test.checks && test.checks.length > 0) {
                return test.checks.map((check: any) => check.status[0]);
            }
            return [];
        },
        [JSON.stringify(test)],
    );
    return (
        <td
            key={type}
            title={test.level}
            data-test={`table-row-${tableColumns[type].label}`}
            style={{
                ...tableColumns[type].cellStyle,
                paddingLeft: '2px',
            }}
        >
            <Group position="left" spacing={0} noWrap>
                <StatusesRing statuses={checkStatuses} key={type} ml={-4} />
                <Tooltip label={test[type]} multiline>
                    <Text
                        lineClamp={1}
                        sx={{ wordBreak: 'break-all' }}
                    >
                        {test.status}
                    </Text>
                </Tooltip>
            </Group>
        </td>
    );
}
