import * as React from 'react';
import { Badge, Divider, Group, Stack, Text } from '@mantine/core';
import * as dateFns from 'date-fns';
import { sizes } from './checkSizes';
import { StatusIcon } from '../../../../../shared/components/Check/StatusIcon';
import { LabelUser } from '../../../../../shared/components/Users/LabelUser';
import { BrowserIcon } from '../../../../../shared/components/Check/BrowserIcon';
import { OsIcon } from '../../../../../shared/components/Check/OsIcon';
import { ViewPortLabel } from './ViewPortLabel';
import { getStatusMessage } from '../../../../../shared/utils/utils';

interface Props {
    check: any;
}

export function PreviewCheckTooltipLabel({ check }: Props) {
    const statusMsg = getStatusMessage(check);

    return (
        <Stack
            sx={{ maxWidth: '370px' }}
            spacing={8}
            p={8}
            data-check-tooltip-name={check.name}
        >
            <Group>
                <Text size={16} lineClamp={1}>
                    {check.name}
                </Text>
            </Group>
            <Divider />
            <Group position="left" spacing={8} ml={-6} noWrap>
                <Group>
                    <StatusIcon status={check.status[0]} size={72} />
                </Group>
                <Group>
                    <Text size="sm" data-test="status-label">
                        {check.status[0][0].toUpperCase() + check.status[0].substring(1)}
                        {statusMsg}
                    </Text>
                </Group>
            </Group>
            {
                check.markedByUsername && (
                    <Group position="apart">
                        <Group>
                            <Text size="xs">Accepted by: </Text>
                        </Group>
                        <Group position="right">
                            {
                                check.markedByUsername && (
                                    <LabelUser dataTest="user-label" username={check.markedByUsername} size="xs" />
                                )
                            }
                        </Group>
                    </Group>
                )
            }
            <Group position="apart">
                <Group>
                    <Text size="xs">Platform: </Text>
                </Group>
                <Group position="right" spacing={6}>
                    <OsIcon os={check.os} size={24} />
                    <Text size="xs" data-test="os-label">{check.os}</Text>
                </Group>
            </Group>
            <Group position="apart" noWrap>
                <Group>
                    <Text size="xs">Browser: </Text>
                </Group>
                <Group position="right" spacing={6} noWrap>
                    <BrowserIcon size={24} browser={check.browserName} />
                    <Text size="xs" data-test="browser-label">
                        {check.browserName}
                        -
                        {check.browserFullVersion}
                    </Text>
                </Group>
            </Group>

            <Group position="apart">
                <Group>
                    <Text size="xs">Viewport: </Text>
                </Group>
                <Group position="right">
                    <ViewPortLabel
                        fontSize="11px"
                        size="md"
                        color="blue"
                        check={check}
                        sizes={sizes}
                        checksViewSize="small"
                    />
                </Group>
            </Group>

            <Group position="apart">
                <Group>
                    <Text size="xs">Branch: </Text>
                </Group>
                <Group position="right">
                    <Badge color="blue" sx={{ maxWidth: 200 }}>
                        {check.branch}
                    </Badge>
                </Group>
            </Group>

            <Group position="apart">
                <Group>
                    <Text size="xs">Created Date: </Text>
                </Group>
                <Group>
                    <Badge color="blue" data-test="date-tooltip-label">
                        {dateFns.format(dateFns.parseISO(check.createdDate), 'yyyy-MM-dd HH:mm:ss')}
                    </Badge>
                </Group>
            </Group>
        </Stack>
    );
}
