/* eslint-disable max-len,no-underscore-dangle,react/jsx-no-useless-fragment */
// noinspection CheckTagEmptyBody
import * as React from 'react';
import {
    Badge,
    Card,
    Group,
    Image,
    Paper,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { TbQuestionMark } from 'react-icons/tb';

import {
    SiAndroid,
    SiApple,
    SiFirefox, SiGooglechrome, SiInternetexplorer,
    SiIos,
    SiLinux,
    SiMicrosoftedge,
    SiSafari,
    SiWindows,
} from 'react-icons/si';

import queryString from 'query-string';
import { useLocalStorage } from '@mantine/hooks';
import { useParams } from '../../../../hooks/useParams';
import config from '../../../../../config';
import { AcceptButton } from './AcceptButton';
import { RemoveButton } from './RemoveButton';
import { ViewPortLabel } from './ViewPortLabel';

interface Props {
    check: any
    checksViewMode: string,
    testUpdateQuery: any,
    checksQuery: any,
}

const osIconMap = (key: string) => {
    const map = {
        'Linux x86_64': SiLinux,
        ios: SiIos,
        android: SiAndroid,
        Win32: SiWindows,
        WINDOWS: SiWindows,
        MacIntel: SiApple,
        macOS: SiApple,
    } as { [key: string]: any };
    return map[key] || TbQuestionMark;
};

const browserIconMap = (key: string) => {
    const map = {
        chrome: SiGooglechrome,
        'chrome [HEADLESS]': SiGooglechrome,
        Chrome: SiGooglechrome,
        firefox: SiFirefox,
        Firefox: SiFirefox,
        msedge: SiMicrosoftedge,
        Msedge: SiMicrosoftedge,
        Safari: SiSafari,
        safari: SiSafari,
        'internet explorer': SiInternetexplorer,
    } as { [key: string]: any };
    return map[key] || TbQuestionMark;
};

export function Check({ check, checksViewMode, checksQuery, testUpdateQuery }: Props) {
    const { setQuery, query } = useParams();
    const [checksViewSize, setChecksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });
    const sizes = {
        small: {
            coefficient: 0.5,
            statusBadge: 'xs',
            viewportText: 'xs',
        },
        medium: {
            coefficient: 0.8,
            statusBadge: 'sm',
            viewportText: 'sm',
        },
        large: {
            coefficient: 1.4,
            statusBadge: 'md',
            viewportText: 'sm',
        },
        xlarge: {
            coefficient: 2,
            statusBadge: 'md',
            viewportText: 'sm',
        },

    } as { [key: string]: any };

    const imageWeight: number = 24 * sizes[checksViewSize].coefficient;
    const OsIcon = osIconMap(check.os as string);
    const BrowserIcon = browserIconMap(check.browserName as string);
    const theme = useMantineTheme();

    const statusColor = (status: string) => {
        const map = {
            new: 'blue',
            passed: 'green',
            failed: 'red',
        } as { [key: string]: any };
        return map[status] || 'gray';
    };

    const imageFilename = check.diffId?.filename || check.actualSnapshotId?.filename || check.baselineId?.filename;
    const imagePreviewSrc = `${config.baseUri}/snapshoots/${imageFilename}`;
    const linkToCheckOverlay = `/index2?${queryString.stringify({ ...query, checkId: check._id })}`;
    const handlePreviewLinkClick = (e: React.MouseEvent) => {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
    };

    const handlePreviewImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.metaKey || e.ctrlKey) return;
        setQuery({ checkId: check._id });
    };

    return (
        <>
            {
                (checksViewMode === 'list')
                    ? (
                        // LIST VIEW
                        <Group
                            p="sm"
                            sx={{
                                width: '100%',
                                borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`,
                                '&:hover': {
                                    // border: `1px solid ${theme.colors.gray[3]}`,
                                    backgroundColor: theme.colors.gray[2],
                                },
                            }}
                            position="apart"
                        >
                            <Paper shadow="md" pb={0}>
                                <Image
                                    src={imagePreviewSrc}
                                    fit="contain"
                                    // fit={'scale-down'}
                                    // fit={'cover'} //default
                                    // fit={'none'}
                                    // fit={'fill'}
                                    width={imageWeight * 4}
                                    // height="100px"
                                    withPlaceholder
                                    alt={check.name}
                                    // sx={{
                                    //     cursor: 'pointer',
                                    //     // border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`
                                    // }}
                                    styles={
                                        () => ({
                                            image: {
                                                // cursor: 'pointer',
                                                height: 'auto',
                                                aspectRatio: '1/1',
                                                // height: '10%!important',
                                            },
                                        })
                                    }
                                    onClick={() => setQuery({ checkId: check._id })}
                                />

                            </Paper>
                            <Text sx={{ width: '50%' }}>{check.name}</Text>
                            <Group position="right">
                                <Badge color={statusColor(check.status)} variant="light" size="md" title="Check status">
                                    {check.status}
                                </Badge>
                                <Text
                                    color="dimmed"
                                    weight={500}
                                    size={14}
                                    title="Screen Viewport"
                                >
                                    {check.viewport}
                                </Text>
                                {/* <OsIcon size={16} title={check.os} /> */}
                                {/* <BrowserIcon size={16} title={`${check.browserName} ${check.browserFullVersion}`} /> */}
                                <Group spacing={4} position="left" noWrap>
                                    <AcceptButton
                                        check={check}
                                        testUpdateQuery={testUpdateQuery}
                                        checksQuery={checksQuery}
                                    />

                                    <RemoveButton
                                        checksQuery={checksQuery}
                                        testUpdateQuery={testUpdateQuery}
                                        check={check}
                                    />
                                </Group>
                            </Group>
                        </Group>
                    )
                    : (
                        // CARD VIEW
                        <Card
                            sx={{
                                // width: 250,
                                width: `${imageWeight}%`,
                                '&:hover': {
                                    boxShadow: '0 1px 3px rgb(0 0 0 / 15%), rgb(0 0 0 / 15%) 0px 10px 15px -5px, rgb(0 0 0 / 14%) 0px 7px 7px -5px',
                                },
                            }}
                            m={1}
                            pt={0}
                            pb={0}
                            pl={0}
                            pr={0}
                            shadow="sm"
                        >

                            {/* <Group position="apart" mt="xs" mb="xs"> */}
                            <Paper
                                p="sm"
                                ml={0}
                                mr={0}
                                sx={{
                                    backgroundColor: (theme.colorScheme === 'dark')
                                        ? theme.colors.dark[8]
                                        : theme.colors.gray[2],
                                }}
                                radius={0}
                            >
                                <Text>{check.name}</Text>
                            </Paper>

                            <Card.Section m={2}>
                                <Group position="center">
                                    <a
                                        href={linkToCheckOverlay}
                                        onClick={handlePreviewLinkClick}
                                        style={{ display: 'inline-block' }}
                                    >
                                        <Image
                                            src={imagePreviewSrc}
                                            fit="contain"
                                            // fit={'scale-down'}
                                            // fit={'cover'} //default
                                            // fit={'none'}
                                            // fit={'fill'}
                                            width="100%"
                                            // height={checksViewMode === 'bounded' ? 222 : 'auto'}
                                            // withPlaceholder
                                            alt={check.name}
                                            // sx={{ height: '10px' }}
                                            styles={
                                                () => ({
                                                    image: {
                                                        // cursor: 'pointer',
                                                        height: 'auto',
                                                        aspectRatio: checksViewMode === 'bounded' ? '1/1' : '',
                                                        // height: '10%!important',
                                                    },
                                                })
                                            }
                                            onClick={handlePreviewImageClick}
                                        />
                                    </a>
                                </Group>
                            </Card.Section>

                            {/* CHECK TOOLBAR */}
                            <Group position="apart" pl="xs" pr="xs" mt="xs" mb={8} spacing="xs" align="center" noWrap>
                                <Badge
                                    color={statusColor(check.status)}
                                    variant="light"
                                    size={sizes[checksViewSize].statusBadge}
                                    title="Check status"
                                >
                                    <Group spacing={0} noWrap>
                                        {check.status}
                                    </Group>
                                </Badge>

                                <ViewPortLabel check={check} sizes={sizes} checksViewSize={checksViewSize} />
                                {/* <OsIcon size={16} title={check.os} /> */}
                                {/* <BrowserIcon size={16} title={`${check.browserName} ${check.browserFullVersion}`} /> */}
                                <Group spacing={4} position="right" noWrap>
                                    <AcceptButton
                                        check={check}
                                        testUpdateQuery={testUpdateQuery}
                                        checksQuery={checksQuery}
                                    />

                                    <RemoveButton
                                        checksQuery={checksQuery}
                                        testUpdateQuery={testUpdateQuery}
                                        check={check}
                                    />
                                </Group>
                            </Group>
                        </Card>
                    )
            }
        </>
    );
}
