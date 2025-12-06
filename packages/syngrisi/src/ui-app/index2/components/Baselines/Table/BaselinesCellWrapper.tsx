import * as React from 'react';
import { Text, Tooltip, Group } from '@mantine/core';
import * as dateFns from 'date-fns';
import { baselinesTableColumns } from './baselinesTableColumns';
import { PreviewCell } from './Cells/PreviewCell';
import { UsageCountCell } from './Cells/UsageCountCell';
import { OsIcon } from '@shared/components/Check/OsIcon';
import { BrowserIcon } from '@shared/components/Check/BrowserIcon';

interface Props {
    type: string
    baseline: any
    itemValue: string
}

export function BaselinesCellWrapper({ type, baseline, itemValue }: Props) {
    const style = baselinesTableColumns[type]?.cellStyle || {};
    const label = baselinesTableColumns[type]?.label || '';

    if (type === 'preview') {
        return <PreviewCell baseline={baseline} />;
    }

    if (type === 'usageCount') {
        return <UsageCountCell baseline={baseline} />;
    }

    if (type === 'createdDate') {
        return (
            <td key={type} style={style}>
                <Tooltip label={itemValue} withinPortal>
                    <Text lineClamp={1} sx={{ wordBreak: 'break-all' }}>
                        {itemValue ? dateFns.format(dateFns.parseISO(itemValue), 'yyyy-MM-dd HH:mm:ss') : ''}
                    </Text>
                </Tooltip>
            </td>
        );
    }

    if (type === 'os') {
        return (
            <td key={type} style={style}>
                <Tooltip label={itemValue} multiline withinPortal>
                    <Group spacing={6} align="center" noWrap>
                        <OsIcon size={18} os={itemValue} />
                        <Text lineClamp={1} sx={{ wordBreak: 'break-all' }}>
                            {itemValue}
                        </Text>
                    </Group>
                </Tooltip>
            </td>
        );
    }

    if (type === 'browserName') {
        return (
            <td key={type} style={style}>
                <Tooltip label={itemValue} multiline withinPortal>
                    <Group spacing={6} align="center" noWrap>
                        <BrowserIcon size={18} browserName={itemValue} />
                        <Text lineClamp={1} sx={{ wordBreak: 'break-all' }}>
                            {itemValue}
                        </Text>
                    </Group>
                </Tooltip>
            </td>
        );
    }

    // Default for other string fields (name, branch, viewport, markedAs, etc.)
    return (
        <td
            key={type}
            data-test={`table-row-${label}`}
            aria-label={`${label}: ${itemValue}`}
            style={style}
        >
            <Tooltip label={itemValue} multiline withinPortal>
                <Text
                    lineClamp={1}
                    sx={{ wordBreak: 'break-all' }}
                    data-testid={type === 'name' ? `baseline-name-${itemValue}` : undefined}
                >
                    {itemValue}
                </Text>
            </Tooltip>
        </td>
    );
}
