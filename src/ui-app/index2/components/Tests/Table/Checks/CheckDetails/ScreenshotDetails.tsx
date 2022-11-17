/* eslint-disable */
import * as React from 'react';
import { useMemo } from 'react';
import { Badge, Loader, Tooltip, Group, Text, createStyles } from '@mantine/core';
import * as dateFns from 'date-fns';

const useStyles = createStyles((theme) => ({
    infoBadges: {
        marginLeft: 8,
        paddingLeft: 4,
        paddingRight: 4,
    },
    labels: {
        '@media (max-width: 1070px)': {
            display: 'none',
        },
    }
}));

interface Props {
    mainView: any
    view: string
    check: any
}

export function ScreenshotDetails({ mainView, view, check }: Props) {
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
                    <Badge color="blue" radius={'sm'} className={classes.infoBadges}>
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
    const createdDate = view === 'actual'
        ? dateFns.format(dateFns.parseISO(check?.actualSnapshotId?.createdDate), 'yyyy-MM-dd HH:mm:ss')
        : dateFns.format(dateFns.parseISO(check?.baselineId?.createdDate), 'yyyy-MM-dd HH:mm:ss')

    return (
        <Group spacing="sm" noWrap>
            {
                view !== 'slider'
                    ? (
                        <>
                            <Group spacing={0} noWrap>
                                <Text size="sm" lineClamp={1} className={classes.labels} title="Image size">
                                    Image Size:
                                </Text>
                                <Text size="sm">
                                    {imageSize}
                                </Text>
                            </Group>

                            <Group spacing={0} noWrap>
                                <Text lineClamp={1} className={classes.labels} size="sm">
                                    Date:
                                </Text>
                                <Tooltip label={`Image Date: ${createdDate}`} withinPortal>

                                    <Badge color="blue" radius={'sm'} className={classes.infoBadges}>
                                        {
                                            createdDate
                                        }
                                    </Badge>
                                </Tooltip>
                            </Group>
                            {
                                view === 'diff' && (
                                    <>
                                        <Group spacing={0} noWrap>
                                            <Text lineClamp={1} size="sm" className={classes.labels}>
                                                Difference:
                                            </Text>
                                            <Tooltip label={`Images difference: ${diffPercent} %`} withinPortal>
                                                <Badge color="blue" radius={'sm'} sx={{ maxWidth: 100 }}
                                                       className={classes.infoBadges}>
                                                    {diffPercent}%
                                                </Badge>
                                            </Tooltip>
                                        </Group>
                                    </>
                                )
                            }
                        </>
                    )
                    : (
                        <>
                        </>
                    )
            }

        </Group>
    );
}
