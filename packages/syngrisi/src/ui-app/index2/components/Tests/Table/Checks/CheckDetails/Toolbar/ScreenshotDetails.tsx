/* eslint-disable */
import * as React from 'react';
import { useMemo } from 'react';
import { Badge, Loader, Tooltip, Group, Text, createStyles, ActionIcon } from '@mantine/core';
import { IconRuler2, IconCalendar, IconPercentage } from '@tabler/icons-react';
import * as dateFns from 'date-fns';

const useStyles = createStyles((theme) => ({
    infoBadges: {
        marginLeft: 4,
        paddingLeft: 4,
        paddingRight: 4,
    },
    detailsGroup: {
        '@media (max-width: 700px)': {
            display: 'none',
        },
    },
    iconLabel: {
        color: theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[6],
        flexShrink: 0,
    },
    labelText: {
        fontSize: theme.fontSizes.sm,
        whiteSpace: 'nowrap',
        '@media (max-width: 1400px)': {
            display: 'none',
        },
    },
}));

interface Props {
    mainView: any
    view: string
    check: any
}

export function ScreenshotDetails({ mainView, view, check = {} }: Props) {
    const { classes } = useStyles();

    const checkResult = check.result ? JSON.parse(check.result) : null
    let diffPercent = checkResult.misMatchPercentage ? (checkResult.misMatchPercentage) : ''
    diffPercent = (
        (diffPercent === '0.00' || diffPercent === '')
        && (checkResult.rawMisMatchPercentage?.toString()?.length > 0)
    ) ?
        checkResult.rawMisMatchPercentage :
        checkResult.misMatchPercentage;

    const imageSize = useMemo(() => {
        if (view === 'slider') return null;
        if (mainView) {
            const image = mainView[`${view}Image`];
            if (view === 'diff' && !mainView?.diffImage) return null;
            return (
                <Tooltip
                    withinPortal
                    label={`Screenshot size: ${image.width}x${image.height}, click to open the image in a new tab`}
                >
                    <Badge color="blue" radius={'sm'} className={classes.infoBadges} data-check="image-size">
                        <a
                            href={image.getSrc()}
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
            <Badge color="blue" radius={'sm'} className={classes.infoBadges}>
                <Loader size="xs" color="blue" variant="dots" />
            </Badge>
        );
    }, [mainView, view]);

    const actualDateFull = check?.actualSnapshotId?.createdDate
        ? dateFns.format(dateFns.parseISO(check?.actualSnapshotId?.createdDate), 'yyyy-MM-dd HH:mm:ss')
        : '';
    const baselineDateFull = check?.baselineId?.createdDate
        ? dateFns.format(dateFns.parseISO(check?.baselineId?.createdDate), 'yyyy-MM-dd HH:mm:ss')
        : '';
    const actualDateShort = check?.actualSnapshotId?.createdDate
        ? dateFns.format(dateFns.parseISO(check?.actualSnapshotId?.createdDate), 'HH:mm:ss')
        : '';
    const baselineDateShort = check?.baselineId?.createdDate
        ? dateFns.format(dateFns.parseISO(check?.baselineId?.createdDate), 'HH:mm:ss')
        : '';

    const createdDateFull = view === 'actual' ? actualDateFull : baselineDateFull;
    const createdDateShort = view === 'actual' ? actualDateShort : baselineDateShort;

    return (
        <Group spacing="xs" noWrap className={classes.detailsGroup}>
            {view !== 'slider' && (
                <>
                    <Tooltip label={`Image size`} withinPortal>
                        <Group spacing={2} noWrap>
                            <IconRuler2 size={16} className={classes.iconLabel} />
                            <Text className={classes.labelText}>Size:</Text>
                            {imageSize}
                        </Group>
                    </Tooltip>

                    <Tooltip label={`Image Date: ${createdDateFull}`} withinPortal>
                        <Group spacing={2} noWrap>
                            <IconCalendar size={16} className={classes.iconLabel} />
                            <Text className={classes.labelText}>Date:</Text>
                            <Badge color="blue" radius="sm" className={classes.infoBadges} data-check="image-date">
                                {createdDateShort}
                            </Badge>
                        </Group>
                    </Tooltip>

                    {view === 'diff' && (
                        <Tooltip label={`Images difference: ${diffPercent}%`} withinPortal>
                            <Group spacing={2} noWrap>
                                <IconPercentage size={16} className={classes.iconLabel} />
                                <Text className={classes.labelText}>Diff:</Text>
                                <Badge
                                    color="blue"
                                    radius="sm"
                                    sx={{ maxWidth: 80 }}
                                    data-check="diff-percent"
                                    className={classes.infoBadges}
                                >
                                    {diffPercent}%
                                </Badge>
                            </Group>
                        </Tooltip>
                    )}
                </>
            )}
        </Group>
    );
}
