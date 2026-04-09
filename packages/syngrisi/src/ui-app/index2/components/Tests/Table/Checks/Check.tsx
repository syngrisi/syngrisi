/* eslint-disable max-len,no-underscore-dangle,react/jsx-no-useless-fragment */
// noinspection CheckTagEmptyBody
import * as React from 'react';
import {
    Box,
    Card,
    Group,
    Image,
    Paper,
    Skeleton,
    Text,
    Tooltip,
    useMantineTheme, useComputedColorScheme,
} from '@mantine/core';

import { useLocalStorage } from '@mantine/hooks';
import { useParams, encodeQueryParams } from '@hooks/useParams';
import { stringify } from '@shared/utils/queryParams';
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
    const { onMouseEnter: onHoverPreload } = useImagePreloadOnHover(check);

    const previewImages = React.useMemo(() => ({
        diff: check.diffId?.filename
            ? `${config.baseUri}/snapshoots/${check.diffId.filename}`
            : null,
        actual: check.actualSnapshotId?.filename
            ? `${config.baseUri}/snapshoots/${check.actualSnapshotId.filename}`
            : null,
        expected: check.baselineId?.filename
            ? `${config.baseUri}/snapshoots/${check.baselineId.filename}`
            : null,
    }), [check.actualSnapshotId?.filename, check.baselineId?.filename, check.diffId?.filename]);

    const previewCycle = React.useMemo(
        () => ([
            previewImages.actual ? { key: 'actual', src: previewImages.actual } : null,
            previewImages.expected ? { key: 'expected', src: previewImages.expected } : null,
            previewImages.diff ? { key: 'diff', src: previewImages.diff } : null,
        ].filter(Boolean) as Array<{ key: 'actual' | 'expected' | 'diff', src: string }>),
        [previewImages.actual, previewImages.diff, previewImages.expected],
    );

    const defaultPreviewKey = previewImages.diff ? 'diff' : previewCycle[0]?.key || null;
    const hoverStartPreviewKey = previewImages.actual ? 'actual' : previewCycle[0]?.key || defaultPreviewKey;
    const [activePreviewKey, setActivePreviewKey] = React.useState<'actual' | 'expected' | 'diff' | null>(defaultPreviewKey);
    const [isPreviewHovered, setIsPreviewHovered] = React.useState(false);
    const hoverTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastPointerRef = React.useRef<{ x: number, y: number } | null>(null);
    const hoverCycleEnabledRef = React.useRef(false);

    const imagePreviewSrc = React.useMemo(() => {
        const activePreview = previewCycle.find((preview) => preview.key === activePreviewKey);
        return activePreview?.src || previewImages.diff || previewImages.actual || previewImages.expected || '';
    }, [activePreviewKey, previewCycle, previewImages.actual, previewImages.diff, previewImages.expected]);

    const previewLabel = React.useMemo(() => {
        const labelMap = {
            actual: 'Actual',
            expected: 'Expected',
            diff: 'Diff',
        } as const;
        const key = activePreviewKey || defaultPreviewKey || 'diff';
        return labelMap[key as keyof typeof labelMap] || 'Preview';
    }, [activePreviewKey, defaultPreviewKey]);

    React.useEffect(() => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverCycleEnabledRef.current = false;
        lastPointerRef.current = null;
        setIsPreviewHovered(false);
        setActivePreviewKey(defaultPreviewKey);
    }, [check._id, defaultPreviewKey]);

    React.useEffect(() => () => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    }, []);

    const overlayParamsString = stringify(
        encodeQueryParams(
            queryConfig,
            { ...query, ['checkId' as string]: check._id },
        ),
    );
    const linkToCheckOverlay = `/?${overlayParamsString}&modalIsOpen=true`;

    const handlePreviewMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        onHoverPreload();
        setIsPreviewHovered(true);
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverCycleEnabledRef.current = false;
        lastPointerRef.current = { x: e.clientX, y: e.clientY };
        hoverTimerRef.current = setTimeout(() => {
            hoverCycleEnabledRef.current = true;
            setActivePreviewKey(hoverStartPreviewKey);
        }, 100);
    };

    const handlePreviewMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!hoverCycleEnabledRef.current || previewCycle.length <= 1) return;

        const pointer = { x: e.clientX, y: e.clientY };
        const previousPointer = lastPointerRef.current;
        lastPointerRef.current = pointer;

        if (!previousPointer) return;

        const distance = Math.hypot(pointer.x - previousPointer.x, pointer.y - previousPointer.y);
        if (distance < 3) return;

        const stepCount = Math.max(1, Math.floor(distance / 3));
        setActivePreviewKey((currentKey) => {
            const currentIndex = previewCycle.findIndex((preview) => preview.key === currentKey);
            const fallbackIndex = previewCycle.findIndex((preview) => preview.key === hoverStartPreviewKey);
            const startIndex = currentIndex >= 0 ? currentIndex : Math.max(fallbackIndex, 0);
            return previewCycle[(startIndex + stepCount) % previewCycle.length]?.key || defaultPreviewKey;
        });
    };

    const handlePreviewMouseLeave = () => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverCycleEnabledRef.current = false;
        lastPointerRef.current = null;
        setIsPreviewHovered(false);
        setActivePreviewKey(defaultPreviewKey);
    };

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
                            onMouseEnter={handlePreviewMouseEnter}
                            onMouseMove={handlePreviewMouseMove}
                            onMouseLeave={handlePreviewMouseLeave}
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
                            <Paper shadow="0" pb={0}>
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
                                            <Box style={{ position: 'relative', display: 'inline-flex' }}>
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
                                                <Box
                                                    style={{
                                                        position: 'absolute',
                                                        left: 8,
                                                        right: 8,
                                                        top: 8,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        pointerEvents: 'none',
                                                        opacity: isPreviewHovered ? 1 : 0,
                                                        transform: isPreviewHovered ? 'translateY(0)' : 'translateY(-6px)',
                                                        transition: 'opacity 160ms ease, transform 180ms ease',
                                                    }}
                                                >
                                                    <Text
                                                        fw={500}
                                                        c="rgba(255, 255, 255, 0.82)"
                                                        tt="uppercase"
                                                        style={{
                                                            fontSize: '6px',
                                                            padding: '2px 4px',
                                                            borderRadius: 999,
                                                            backgroundColor: 'rgba(15, 16, 20, 0.4)',
                                                            backdropFilter: 'blur(2px)',
                                                            letterSpacing: '0.06em',
                                                            lineHeight: 1,
                                                        }}
                                                    >
                                                        {previewLabel}
                                                    </Text>
                                                </Box>
                                            </Box>
                                        </Group>
                                    </a>
                                </Tooltip.Floating>
                            </Paper>
                            <Tooltip label={check.name} multiline withinPortal>
                                <Text
                                    lineClamp={2}
                                    fz={14}
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
                            onMouseEnter={handlePreviewMouseEnter}
                            onMouseMove={handlePreviewMouseMove}
                            onMouseLeave={handlePreviewMouseLeave}
                            radius="sm"
                            style={{
                                width: `${imageWeight}%`,
                                overflow: 'hidden',
                                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
                                transition: 'background-color 140ms ease',
                            }}
                            m={1}
                            pt={0}
                            pb={0}
                            pl={0}
                            pr={0}
                            shadow="0"
                        >
                            <Paper
                                py={10}
                                px={12}
                                ml={0}
                                mr={0}
                                shadow="0"
                                style={{
                                    backgroundColor: colorScheme === 'dark'
                                        ? theme.colors.dark[6]
                                        : theme.colors.gray[0],
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
                                        fw={500}
                                        fz={12}
                                        style={{
                                            lineHeight: '16px',
                                            letterSpacing: '-0.005em',
                                            fontFamily: '"Roboto","Helvetica Neue","Arial",sans-serif',
                                        }}
                                        data-table-check-name={check.name}
                                    >
                                        {check.name}
                                    </Text>
                                </Tooltip>
                            </Paper>
                            <Card.Section m={0}>
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
                                            <Box style={{ position: 'relative', width: '100%' }}>
                                                <Image
                                                    data-test-preview-image={check.name}
                                                    src={imagePreviewSrc}
                                                    fit="contain"
                                                    alt={check.name}
                                                    fallbackSrc=""
                                                    w="100%"
                                                    h="auto"
                                                    style={{
                                                        maxHeight: checksViewMode === 'bounded' ? `${imageWeight * 8}px` : undefined,
                                                    }}
                                                />
                                                <Box
                                                    style={{
                                                        position: 'absolute',
                                                        left: 10,
                                                        right: 10,
                                                        top: 10,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        pointerEvents: 'none',
                                                        opacity: isPreviewHovered ? 1 : 0,
                                                        transform: isPreviewHovered ? 'translateY(0)' : 'translateY(-6px)',
                                                        transition: 'opacity 160ms ease, transform 180ms ease',
                                                    }}
                                                >
                                                    <Text
                                                        fw={500}
                                                        c="rgba(255, 255, 255, 0.82)"
                                                        tt="uppercase"
                                                        style={{
                                                            fontSize: '6px',
                                                            padding: '2px 4px',
                                                            borderRadius: 999,
                                                            backgroundColor: 'rgba(15, 16, 20, 0.4)',
                                                            backdropFilter: 'blur(2px)',
                                                            letterSpacing: '0.06em',
                                                            lineHeight: 1,
                                                        }}
                                                    >
                                                        {previewLabel}
                                                    </Text>
                                                </Box>
                                            </Box>
                                        </Group>
                                    </a>

                                </Tooltip>
                            </Card.Section>

                            {/* CHECK TOOLBAR */}
                            <Group justify="space-between" px={12} mt={4} mb={6} gap={6} align="center" wrap="nowrap">
                                <Status check={check} variant="filled" size="xs" />

                                <ViewPortLabel
                                    check={check}
                                    sizes={sizes}
                                    color="blue"
                                    size="xs"
                                    fontSize="9px"
                                    checksViewSize={checksViewSize}
                                    displayed={(checksViewSize !== 'small')}
                                />
                                <Group gap={6} justify="flex-end" wrap="nowrap">
                                    <AcceptButton
                                        size={24}
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
