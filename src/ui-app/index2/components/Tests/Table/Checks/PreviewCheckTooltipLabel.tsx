import * as React from 'react';
import { Badge, Group, Stack, Text } from '@mantine/core';
import * as dateFns from 'date-fns';
import { sizes } from './checkSizes';
import { StatusIcon } from '../../../../../shared/components/Check/StatusIcon';
import { LabelUser } from '../../../../../shared/components/Users/LabelUser';
import { BrowserIcon } from '../../../../../shared/components/Check/BrowserIcon';
import { OsIcon } from '../../../../../shared/components/Check/OsIcon';
import { ViewPortLabel } from './ViewPortLabel';

interface Props {
    check: any
}

export function PreviewCheckTooltipLabel({ check }: Props) {
    let statusMsg = '';
    if (check.status[0] === 'failed') {
        if (check.failReasons.includes('different_images')) {
            statusMsg = ' - images are different';
            const checkResult = check.result ? JSON.parse(check.result) : null;
            let diffPercent = checkResult.misMatchPercentage ? (checkResult.misMatchPercentage) : '';
            diffPercent = (
                (diffPercent === '0.00' || diffPercent === '')
                && (checkResult.rawMisMatchPercentage?.toString()?.length > 0)
            )
                ? checkResult.rawMisMatchPercentage
                : checkResult.misMatchPercentage;
            statusMsg += ` (${diffPercent}%)`;
        }
        if (check.failReasons.includes('wrong_dimensions')) {
            statusMsg = ' - images have wrong  dimensions';
        }
        if (check.failReasons.includes('not_accepted')) {
            statusMsg = ' - previous check with same parameter is not accepted';
        }
    }
    return (
        <Stack sx={{ maxWidth: '370px' }} spacing={8} p={8}>
            <Group position="left" spacing={8} ml={-6} noWrap>
                <Group>
                    <StatusIcon status={check.status[0]} size={55} />
                </Group>
                <Group>
                    <Text size="lg">
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
                                    <LabelUser username={check.markedByUsername} size="xs" />
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
                    <Text size="xs">{check.os}</Text>
                </Group>
            </Group>
            <Group position="apart" noWrap>
                <Group>
                    <Text size="xs">Browser: </Text>
                </Group>
                <Group position="right" spacing={6} noWrap>
                    <BrowserIcon size={24} browser={check.browserName} />
                    <Text size="xs">
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
                    <Badge color="blue">
                        {check.branch}
                    </Badge>
                </Group>
            </Group>

            <Group position="apart">
                <Group>
                    <Text size="xs">Created Date: </Text>
                </Group>
                <Group>
                    <Badge color="blue">
                        {dateFns.format(dateFns.parseISO(check.createdDate), 'yyyy-MM-dd HH:mm:ss')}
                    </Badge>
                </Group>
            </Group>
        </Stack>
    );
}
