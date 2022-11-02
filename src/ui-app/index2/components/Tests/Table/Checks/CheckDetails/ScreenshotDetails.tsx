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
    diffPercent = ((diffPercent === '0.00' || diffPercent === '') && checkResult.rawMisMatchPercentage?.toString()?.length > 0) ?
        checkResult.rawMisMatchPercentage :
        checkResult.misMatchPercentage;

    const imageSize = useMemo(() => {
        if (view === 'slider') return null;
        if (mainView) {
            const image = mainView[`${view}Image`];
            return (
                <Tooltip
                    withinPortal
                    label="Screenshot size, click to open the image in a new tab"
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

    return (
        <Group noWrap>
            {
                view !== 'slider'
                    ? (
                        <>
                            <Text size="sm">
                                Image Size:
                                {imageSize}
                            </Text>
                            <Text size="sm">
                                Image Date:
                                <Badge color="blue" radius={'sm'} className={classes.infoBadges}>
                                    {
                                        view === 'actual'
                                            ? dateFns.format(dateFns.parseISO(check?.actualSnapshotId?.createdDate), 'yyyy-MM-dd HH:mm:ss')
                                            : dateFns.format(dateFns.parseISO(check?.baselineId?.createdDate), 'yyyy-MM-dd HH:mm:ss')
                                    }
                                </Badge>
                            </Text>
                            {
                                view === 'diff' && (
                                    <>
                                        <Text size="sm">
                                            Difference:
                                            <Badge color="blue" radius={'sm'}
                                                   className={classes.infoBadges}>
                                                {diffPercent}%
                                            </Badge>
                                        </Text>
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
