/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Group, Image, Paper, useMantineTheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import config from '../../../../../../config';
import { Status } from '../../../../../../shared/components/Check/Status';
import { ViewPortLabel } from '../ViewPortLabel';
import { sizes } from '../checkSizes';
import { BrowserIcon } from '../../../../../../shared/components/Check/BrowserIcon';
import { OsIcon } from '../../../../../../shared/components/Check/OsIcon';

interface Props {
    checkData: any
    setActiveCheck: any
    activeCheck: any
}

export function RelatedCheckItem({ checkData, activeCheck, setActiveCheck }: Props) {
    const check = checkData;
    const theme = useMantineTheme();
    const imageFilename = check.diffId?.filename || check.actualSnapshotId?.filename || check.baselineId?.filename;
    const imagePreviewSrc = `${config.baseUri}/snapshoots/${imageFilename}`;
    const [checksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });

    const handleItemClick = () => {
        setActiveCheck(() => check._id);
    };

    return (
        <Group
            onClick={handleItemClick}
            spacing={8}
            p="sm"
            sx={{
                cursor: 'pointer',
                width: '88%',
                borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]}`,
                // eslint-disable-next-line no-nested-ternary
                backgroundColor: (check._id === activeCheck)
                    ? (theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2])
                    : '',

                '&:hover': {
                    // border: `1px solid ${theme.colors.gray[3]}`,
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3],
                },
            }}
            position="apart"

        >
            <Paper shadow="sm" pb={0} mr={22}>
                <div style={{ position: 'relative' }}>
                    <Image
                        src={imagePreviewSrc}
                        width="125px"
                        // height="200px"
                        fit="contain"
                        withPlaceholder
                        alt={check.name}
                        styles={
                            () => ({
                                image: {
                                    // cursor: 'pointer',
                                    // height: 'auto',
                                    // aspectRatio: '1/1',
                                    maxHeight: 150,
                                    // height: '10%!important',
                                },
                            })
                        }
                    />
                    <Group pt={8} pb={8} align="center" position="center" spacing={4} noWrap>
                        <ViewPortLabel
                            fontSize="8px"
                            color="blue"
                            check={check}
                            sizes={sizes}
                            checksViewSize={checksViewSize}
                        />
                        <Group align="end" spacing={4}>
                            <BrowserIcon browser={check.browserName} size={12} />
                            <OsIcon os={check.os} size={14} />
                        </Group>

                    </Group>

                    <div style={{ position: 'absolute', top: -12, left: 4, opacity: 1 }}>
                        <Status
                            check={check}
                            size="xs"
                            style={
                                {
                                    opacity: 0.9,
                                    backgroundColor: theme.colors.dark[9],
                                }
                            }
                        />
                    </div>
                </div>
            </Paper>
        </Group>
    );
}
