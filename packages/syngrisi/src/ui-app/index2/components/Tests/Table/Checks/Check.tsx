/* eslint-disable max-len,no-underscore-dangle,react/jsx-no-useless-fragment */
// noinspection CheckTagEmptyBody
import * as React from 'react';
import {
    Card,
    Group,
    Image,
    Paper,
    Skeleton,
    Text,
    Tooltip,
    useMantineTheme, useComputedColorScheme,
} from '@mantine/core';

import { stringify } from '@shared/utils/queryParams';
import { useLocalStorage } from '@mantine/hooks';
import { encodeQueryParams } from 'use-query-params';
import { useParams } from '@hooks/useParams';
import config from '@config';
import { AcceptButton } from '@index/components/Tests/Table/Checks/AcceptButton';
import { RemoveButton } from '@index/components/Tests/Table/Checks/RemoveButton';
import { ViewPortLabel } from '@index/components/Tests/Table/Checks/ViewPortLabel';
import { sizes } from '@index/components/Tests/Table/Checks/checkSizes';
import { Status } from '@shared/components/Check/Status';
import { PreviewCheckTooltipLabel } from '@index/components/Tests/Table/Checks/PreviewCheckTooltipLabel';
import { useImagePreloadOnHover } from '@shared/hooks';

interface Props {
    check: any
    checksViewMode: string,
    testUpdateQuery: any,
    checksQuery: any,
}

export const Check = React.memo(function Check({ check, checksViewMode, checksQuery, testUpdateQuery }: Props) {
    const { setQuery, query, queryConfig } = useParams();
    const [checksViewSize] = useLocalStorage({ key: 'check-view-size', defaultValue: 'medium' });

    const imageWeight: number = 24 * sizes[checksViewSize].coefficient;
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();

    // Preload all check images (baseline, actual, diff) on hover with high priority
    const { onMouseEnter: onHoverPreload } = useImagePreloadOnHover(check);

    const imageFilename = check.diffId?.filename || check.actualSnapshotId?.filename || check.baselineId?.filename;
    const imagePreviewSrc = `${config.baseUri}/snapshoots/${imageFilename}`;

    const overlayParamsString = stringify(
        encodeQueryParams(
            queryConfig,
            { ...query, ['checkId' as string]: check._id },
        ),
    );
    const linkToCheckOverlay = `/?${overlayParamsString}&modalIsOpen=true`;

    const handlePreviewImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!e.metaKey && !e.ctrlKey) e.preventDefault();
        if (e.metaKey || e.ctrlKey) return;
        setQuery({ checkId: check._id });
        setQuery({ modalIsOpen: 'true' });
    };

    return (
        <>
            {
                (checksViewMode === 'list')
                    ? (
                        // LIST VIEW
                        <Group
                            data-check={check.name}
                            p="sm"
                            onMouseEnter={onHoverPreload}
                            style={{
                                width: '100%',
                                borderBottom: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`,
                                '&:hover': {
                                    // border: `1px solid ${theme.colors.gray[3]}`,
                                    backgroundColor: theme.colors.dark[5],
                                },
                            }}
                            justify="space-between"
                        >
                            <Paper shadow="md" pb={0}>
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
                                    <a
                                        style={{ display: 'inline-block', width: '100%', cursor: 'pointer' }}
                                        data-check-previw-link={check.name}
                                        href={linkToCheckOverlay}
                                    >
                                        <Group
                                            justify="center"
                                            style={{ width: '100%', cursor: 'pointer' }}
                                            onClick={handlePreviewImageClick}
                                        >
                                            <Image
                                                src={imagePreviewSrc}
                                                data-test-preview-image={check.name}
                                                fit="contain"
                                                w={`${imageWeight * 4}px`}
                                                alt={check.name}
                                                fallbackSrc=""
                                                style={{
                                                    aspectRatio: '1/1',
                                                }}
                                                onClick={handlePreviewImageClick}
                                            />
                                        </Group>
                                    </a>
                                </Tooltip.Floating>
                            </Paper>
                            <Tooltip label={check.name} multiline withinPortal>
                                <Text
                                    lineClamp={2}
                                    style={{ width: '50%' }}
                                    data-table-check-name={check.name}
                                >
                                    {check.name}
                                </Text>
                            </Tooltip>

                            <Group justify="flex-end">
                                <Status check={check} />
                                <ViewPortLabel
                                    color="blue"
                                    check={check}
                                    sizes={sizes}
                                    checksViewSize={checksViewSize}
                                />

                                <Group gap={4} justify="flex-start" wrap="nowrap">
                                    <AcceptButton
                                        check={check}
                                        testUpdateQuery={testUpdateQuery}
                                        checksQuery={checksQuery}
                                    />

                                    <RemoveButton
                                        check={check}
                                        checksQuery={checksQuery}
                                        testUpdateQuery={testUpdateQuery}
                                    />
                                </Group>
                            </Group>
                        </Group>
                    )
                    : (
                        // CARD VIEW
                        <Card
                            data-check={check.name}
                            onMouseEnter={onHoverPreload}
                            style={{
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
                            <Paper
                                p="sm"
                                ml={0}
                                mr={0}
                                style={{
                                    backgroundColor: (colorScheme === 'dark')
                                        ? theme.colors.dark[8]
                                        : theme.colors.gray[2],
                                }}
                                radius={0}
                            >
                                <Tooltip
                                    label={check.name}
                                    multiline
                                    withinPortal
                                >
                                    <Text
                                        lineClamp={1}
                                        data-table-check-name={check.name}
                                    >
                                        {check.name}
                                    </Text>
                                </Tooltip>
                            </Paper>
                            <Card.Section m={2}>
                                <Tooltip
                                    openDelay={300}
                                    multiline
                                    zIndex={1000}
                                    withinPortal
                                    position="right-start"
                                    color="dark"
                                    label={
                                        <PreviewCheckTooltipLabel check={check} />
                                    }
                                >
                                    <a
                                        style={{ display: 'inline-block', width: '100%', cursor: 'pointer' }}
                                        href={linkToCheckOverlay}
                                        data-check-previw-link={check.name}
                                    >
                                        <Group
                                            justify="center"
                                            style={{ width: '100%', cursor: 'pointer' }}
                                            onClick={handlePreviewImageClick}
                                        >
                                            <Image
                                                data-test-preview-image={check.name}
                                                src={imagePreviewSrc}
                                                fit="contain"
                                                alt={check.name}
                                                fallbackSrc=""
                                                style={{
                                                    maxHeight: checksViewMode === 'bounded' ? `${imageWeight * 8}px` : undefined,
                                                }}
                                            />
                                        </Group>
                                    </a>

                                </Tooltip>
                            </Card.Section>

                            {/* CHECK TOOLBAR */}
                            <Group justify="space-between" pl="sm" pr="sm" mt="xs" mb={8} gap={4} align="center" wrap="nowrap">
                                <Status check={check} variant="filled" />

                                <ViewPortLabel
                                    check={check}
                                    sizes={sizes}
                                    color="blue"
                                    size="md"
                                    fontSize="10px"
                                    checksViewSize={checksViewSize}
                                    displayed={(checksViewSize !== 'small')}
                                />
                                <Group gap={8} justify="flex-end" wrap="nowrap">
                                    <AcceptButton
                                        size={22}
                                        check={check}
                                        testUpdateQuery={testUpdateQuery}
                                        checksQuery={checksQuery}
                                    />

                                    <RemoveButton
                                        size={26}
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
});
