/* eslint-disable */
import * as React from 'react';
import { useMemo } from 'react';
import { Badge, Loader, Tooltip, Group, Text, ActionIcon, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import { IconRuler2, IconCalendar, IconPercentage } from '@tabler/icons-react';
import * as dateFns from 'date-fns';

interface Props {
    mainView: any
    check: any
    view?: string
    apikey?: string
    rcaEnabled?: boolean
}

export function ScreenshotDetails({
    mainView, check = {}, view = 'actual', apikey, rcaEnabled,
}: Props) {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();

    const infoBadgesStyle: React.CSSProperties = {
        marginLeft: 4,
        paddingLeft: 4,
        paddingRight: 4,
    };
    const iconLabelStyle: React.CSSProperties = {
        color: colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[6],
        flexShrink: 0,
    };
    const labelTextStyle: React.CSSProperties = {
        fontSize: theme.fontSizes.sm,
        whiteSpace: 'nowrap',
    };

    const checkResult = check.result ? JSON.parse(check.result) : null;
    let diffPercent = checkResult?.misMatchPercentage ? checkResult.misMatchPercentage : '';
    diffPercent = (
        (diffPercent === '0.00' || diffPercent === '')
        && (checkResult?.rawMisMatchPercentage?.toString()?.length > 0)
    ) ?
        checkResult.rawMisMatchPercentage :
        checkResult?.misMatchPercentage;

    const imageSize = useMemo(() => {
        const imageByView = {
            expected: mainView?.expectedImage,
            actual: mainView?.actualImage,
            diff: mainView?.diffImage,
            slider: mainView?.actualImage,
        } as Record<string, any>;
        const image = imageByView[view] || mainView?.actualImage;

        if (image) {
            let imgSrc = image.getSrc();
            if (apikey) {
                imgSrc += `?apikey=${apikey}`;
            }
            const viewLabel = view === 'expected' ? 'Expected' : view === 'diff' ? 'Diff' : 'Actual';
            return (
                <Tooltip
                    withinPortal
                    label={`${viewLabel} screenshot size: ${image.width}x${image.height}, click to open in a new tab`}
                >
                    <Badge color="blue" radius={'sm'} style={infoBadgesStyle} data-check="image-size">
                        <a
                            href={imgSrc}
                            target="_blank"
                            style={{ color: 'inherit', textDecoration: 'inherit' }}
                            rel="noreferrer"
                        >
                            {`${image.width}x${image.height}`}
                        </a>
                    </Badge>
                </Tooltip>
            );
        }
        return (
            <Badge color="blue" radius={'sm'} style={infoBadgesStyle}>
                <Loader size="xs" color="blue" variant="dots" />
            </Badge>
        );
    }, [mainView, view, apikey]);

    // Always show actual image date (consistent across all view modes)
    const actualDateFull = check?.actualSnapshotId?.createdDate
        ? dateFns.format(dateFns.parseISO(check?.actualSnapshotId?.createdDate), 'yyyy-MM-dd HH:mm:ss')
        : '';
    const actualDateShort = check?.actualSnapshotId?.createdDate
        ? dateFns.format(dateFns.parseISO(check?.actualSnapshotId?.createdDate), 'HH:mm:ss')
        : '';

    // Check if diff is available (not for "new" checks without baseline)
    const hasDiff = diffPercent !== undefined && diffPercent !== null && diffPercent !== '';

    return (
        <Group gap="xs" noWrap style={{ '@media (max-width: 700px)': { display: 'none' } }} className="screenshot-details-group">
            <Tooltip label="Actual image size" withinPortal>
                <Group gap={2} noWrap>
                    <IconRuler2 size={16} style={iconLabelStyle} />
                    <Text style={labelTextStyle}>Size:</Text>
                    {imageSize}
                </Group>
            </Tooltip>

            {!rcaEnabled && (
                <Tooltip label={`Actual image date: ${actualDateFull}`} withinPortal>
                    <Group gap={2} noWrap>
                        <IconCalendar size={16} style={iconLabelStyle} />
                        <Text style={labelTextStyle}>Date:</Text>
                        <Badge c="blue" radius="sm" style={infoBadgesStyle} data-check="image-date">
                            {actualDateShort}
                        </Badge>
                    </Group>
                </Tooltip>
            )}

            {hasDiff && (
                <Tooltip label={`Images difference: ${diffPercent}%`} withinPortal>
                    <Group gap={2} noWrap>
                        <IconPercentage size={16} style={iconLabelStyle} />
                        <Text style={labelTextStyle}>Diff:</Text>
                        <Badge
                            c="blue"
                            radius="sm"
                            style={{ ...infoBadgesStyle, maxWidth: 80 }}
                            data-check="diff-percent"
                        >
                            {diffPercent}%
                        </Badge>
                    </Group>
                </Tooltip>
            )}
        </Group>
    );
}
