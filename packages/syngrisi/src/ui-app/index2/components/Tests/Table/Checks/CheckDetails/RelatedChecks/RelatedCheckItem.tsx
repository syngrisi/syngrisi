/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line */
import * as React from 'react';
import { Group, Image, Paper, useMantineTheme, useComputedColorScheme, Text, Stack, Badge, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconGitBranch } from '@tabler/icons-react';
import config from '@config';
import { Status } from '@shared/components/Check/Status';
import { ViewPortLabel } from '@index/components/Tests/Table/Checks/ViewPortLabel';
import { sizes } from '@index/components/Tests/Table/Checks/checkSizes';
import { BrowserIcon } from '@shared/components/Check/BrowserIcon';
import { OsIcon } from '@shared/components/Check/OsIcon';
import { PreviewCheckTooltipLabel } from '@index/components/Tests/Table/Checks/PreviewCheckTooltipLabel';
import { useParams } from '@hooks/useParams';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
    checkData: any
    setRelatedActiveCheckId: any
    activeCheckId: any
    index: number
}

export function RelatedCheckItem({ checkData, activeCheckId, setRelatedActiveCheckId, index }: Props) {
    const { setQuery } = useParams();
    const queryClient = useQueryClient();
    const check = checkData;
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();
    const imageFilename = check.diffId?.filename || check.actualSnapshotId?.filename || check.baselineId?.filename;
    const imagePreviewSrc = `${config.baseUri}/snapshoots/${imageFilename}`;

    const [checksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });

    const handleItemClick = () => {
        queryClient.setQueryData(
            ['check_for_modal', check._id],
            {
                results: [check],
                page: 1,
                limit: 1,
                totalPages: 1,
                totalResults: 1,
                timestamp: Date.now(),
            },
        );
        setQuery({ checkId: checkData._id });
        setQuery({ modalIsOpen: 'true' });
        setRelatedActiveCheckId(() => check._id);
    };

    const isActive = check._id === activeCheckId;
    const activeBackground = colorScheme === 'dark' ? theme.colors.blue[9] : theme.colors.blue[3];
    const hoverBackground = colorScheme === 'dark' ? theme.colors.blue[5] : theme.colors.blue[4];
    const metaTextStyle: React.CSSProperties = {
        lineHeight: '18.6px',
    };

    return (
        <Group
            className="syngrisi-related-check-item"
            data-related-check-index={index}
            onClick={handleItemClick}
            gap={4}
            mt={1}
            mb={8}
            pr={8}
            pl={8}
            pt={0}
            pb={0}
            style={{
                cursor: 'pointer',
                width: '95%',
                borderBottom: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]}`,
                backgroundColor: isActive ? activeBackground : '',
            }}
            onMouseEnter={(event) => {
                if (!isActive) {
                    event.currentTarget.style.backgroundColor = hoverBackground;
                }
            }}
            onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = isActive ? activeBackground : '';
            }}
            justify="center"

        >
            <Tooltip.Floating
                multiline
                zIndex={1000}
                withinPortal
                position="right-start"
                color="dark"
                label={
                    <PreviewCheckTooltipLabel check={check} />
                }
            >
                <Paper
                    radius={0}
                    shadow="sm"
                    style={{
                        boxSizing: 'border-box',
                        overflow: 'visible',
                        width: '139px',
                        minWidth: '139px',
                        maxWidth: '139px',
                        flexShrink: 0,
                    }}
                    pt={6}
                    pr={0}
                    pl={0}
                    mr={4}
                    ml={4}
                    mt={2}
                    mb={2}
                >
                    <div
                        style={{ position: 'relative', overflow: 'visible' }}
                        data-related-check-item={check.name}
                    >
                        <Stack align="center" mb={4}>
                            <Image
                                data-related-check="image"
                                src={imagePreviewSrc}
                                width="125px"
                                fit="contain"
                                alt={check.name}
                                withPlaceholder
                                style={{ width: '125px', flexShrink: 0 }}
                                styles={
                                    () => ({
                                        image: {
                                            maxHeight: 150,
                                        },
                                    })
                                }
                            />
                        </Stack>
                        <Stack p={4} pt={8} align="start" gap={8}>
                            <Group justify="center" gap={4} style={{ width: '100%' }} wrap="nowrap">
                                <div style={{ minWidth: 0, flex: '1 1 auto' }}>
                                    <ViewPortLabel
                                        fontSize="8px"
                                        color="blue"
                                        check={check}
                                        sizes={sizes}
                                        checksViewSize={checksViewSize}
                                    />
                                </div>
                                <Badge
                                    leftSection={<IconGitBranch style={{ marginTop: '4', marginRight: -2 }} size={9} />}
                                    color="dark"
                                    size="xs"
                                    style={{
                                        flexShrink: 0,
                                        paddingLeft: 4,
                                        paddingRight: 4,
                                    }}
                                >
                                    <Text
                                        lineClamp={1}
                                        style={{
                                            maxWidth: 40,
                                            fontSize: 9,
                                            lineHeight: '13.95px',
                                            fontWeight: 700,
                                        }}
                                        data-related-check="branch"
                                    >
                                        {check.branch}
                                    </Text>
                                </Badge>
                            </Group>
                            <Group pl={8} justify="center" gap={4} style={{ width: '100%' }} wrap="nowrap">
                                <OsIcon os={check.os} size={14} data-related-check="os-icon" />
                                <Text size="xs" lineClamp={1} style={metaTextStyle} data-related-check="os-label">{check.os}</Text>
                            </Group>

                            <Group pl={8} justify="center" gap={4} style={{ width: '100%' }} wrap="nowrap">
                                <BrowserIcon
                                    data-related-check-browser-name={check.browserName}
                                    data-related-check="browser-icon"
                                    browser={check.browserName}
                                    size={14}
                                />
                                <Text
                                    size="xs"
                                    lineClamp={1}
                                    style={metaTextStyle}
                                    data-related-check="browser-name"
                                >
                                    {check.browserName}
                                </Text>
                                <Text
                                    data-related-check="browser-version"
                                    size="xs"
                                    style={{ minWidth: '30%', ...metaTextStyle }}
                                >
                                    - {check.browserVersion}
                                </Text>
                            </Group>
                        </Stack>

                        <div style={{ position: 'absolute', top: -14, left: 6, opacity: 1 }}>
                            <Status
                                data-related-check="status"
                                check={check}
                                size="xs"
                                variant="filled"
                            />
                        </div>
                    </div>
                </Paper>
            </Tooltip.Floating>
        </Group>
    );
}
