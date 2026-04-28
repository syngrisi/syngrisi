/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import {
    ActionIcon,
    Box,
    Button,
    Chip,
    Divider,
    Group,
    Popover,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    Tooltip,
    UnstyledButton,
    VisuallyHidden,
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconX } from '@tabler/icons-react';
import { useDistinctQuery } from '@shared/hooks/useDistinctQuery';
import { escapeRegExp } from '@shared/utils/utils';
import { useParams } from '@hooks/useParams';

export type StatusKey = string;

type StatusOption = {
    key: StatusKey
    label: string
    color: string
};

type QuickFilterProps = {
    searchValue?: string
    onSearchChange?: (value: string) => void
    searchPlaceholder?: string
    statuses?: StatusOption[]
    activeStatuses?: StatusKey[]
    onStatusesChange?: (next: StatusKey[]) => void
    className?: string
};

const defaultStatuses: StatusOption[] = [
    { key: 'New', label: 'New', color: '#3b82f6' },
    { key: 'Failed', label: 'Failed', color: '#ff4d4f' },
    { key: 'Passed', label: 'Passed', color: '#22c55e' },
];

const chipStyles: any = {
    label: {
        maxWidth: '9em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '16px',
        letterSpacing: '0.01em',
    },
};

const chipsRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
};

const sectionLabelProps = {
    fz: 9,
    c: 'gray.6',
    fw: 700,
    tt: 'uppercase' as const,
    style: {
        letterSpacing: '0.08em',
        lineHeight: '14px',
    },
};

const getDistinctItems = (data: any) => (data?.results?.length! > 0 ? data?.results?.map((x: any) => x.name) : []);

export function QuickFilter(
    {
        searchValue,
        onSearchChange,
        searchPlaceholder = 'Filter by test name...',
        statuses = defaultStatuses,
        activeStatuses,
        onStatusesChange,
        className,
    }: QuickFilterProps = {},
) {
    const { setQuery } = useParams();
    const [opened, { toggle, close }] = useDisclosure(false);
    const [internalSearchValue, setInternalSearchValue] = useState('');
    const [internalActiveStatuses, setInternalActiveStatuses] = useState<StatusKey[]>(() => statuses.map((status) => status.key));
    const [browserChipsData, setBrowserChipsData] = useState<string[]>([]);
    const [viewportChipsData, setViewportChipsData] = useState<string[]>([]);
    const [platformChipsData, setPlatformChipsData] = useState<string[]>([]);
    const [acceptedStatusChipsData, setAcceptedStatusChipsData] = useState<string[]>([]);
    const resolvedSearchValue = searchValue ?? internalSearchValue;
    const resolvedActiveStatuses = activeStatuses ?? internalActiveStatuses;
    const [debouncedSearchValue] = useDebouncedValue(resolvedSearchValue, 400);

    const browsersData = useDistinctQuery({ resource: 'test-distinct/browserName' }).data;
    const viewportData = useDistinctQuery({ resource: 'test-distinct/viewport' }).data;
    const platformData = useDistinctQuery({ resource: 'test-distinct/os' }).data;
    const acceptStatusesData = useDistinctQuery({ resource: 'test-distinct/markedAs' }).data;

    const allStatusKeys = useMemo(() => statuses.map((status) => status.key), [statuses]);
    const browsers = useMemo(() => getDistinctItems(browsersData), [browsersData?.results.length]);
    const viewports = useMemo(() => getDistinctItems(viewportData), [viewportData?.results.length]);
    const platforms = useMemo(() => getDistinctItems(platformData), [platformData?.results.length]);
    const acceptStatuses = useMemo(() => getDistinctItems(acceptStatusesData), [acceptStatusesData?.results.length]);
    const activeStatusLabels = useMemo(
        () => statuses
            .filter((status) => resolvedActiveStatuses.includes(status.key))
            .map((status) => status.label),
        [statuses, resolvedActiveStatuses],
    );

    const quickFilterObject: any = useMemo(
        () => {
            const filters = [];
            if (debouncedSearchValue) {
                filters.push({
                    name: {
                        $regex: escapeRegExp(debouncedSearchValue),
                        $options: 'im',
                    },
                });
            }
            if (browserChipsData.length > 0) filters.push({ browserName: { $in: browserChipsData } });
            if (platformChipsData.length > 0) filters.push({ os: { $in: platformChipsData } });
            if (viewportChipsData.length > 0) filters.push({ viewport: { $in: viewportChipsData } });
            if (resolvedActiveStatuses.length !== allStatusKeys.length) filters.push({ status: { $in: resolvedActiveStatuses } });
            if (acceptedStatusChipsData.length > 0) filters.push({ markedAs: { $in: acceptedStatusChipsData } });
            if (filters.length < 1) return {};
            return { $and: filters };
        }, [
            debouncedSearchValue,
            browserChipsData,
            viewportChipsData,
            platformChipsData,
            resolvedActiveStatuses,
            acceptedStatusChipsData,
            allStatusKeys,
        ],
    );

    useEffect(function setQuickFilterQuery() {
        setQuery({ quick_filter: quickFilterObject });
    }, [JSON.stringify(quickFilterObject)]);

    const handleSearchChange = (value: string) => {
        if (searchValue === undefined) {
            setInternalSearchValue(value);
        }
        onSearchChange?.(value);
    };

    const handleStatusesChange = (nextStatuses: StatusKey[]) => {
        if (activeStatuses === undefined) {
            setInternalActiveStatuses(nextStatuses);
        }
        onStatusesChange?.(nextStatuses);
    };

    const handleStatusToggle = (statusKey: StatusKey) => {
        const nextStatuses = resolvedActiveStatuses.includes(statusKey)
            ? resolvedActiveStatuses.filter((key) => key !== statusKey)
            : [...resolvedActiveStatuses, statusKey];
        handleStatusesChange(nextStatuses);
    };

    const resetQuickFilter = () => {
        handleSearchChange('');
        handleStatusesChange(allStatusKeys);
        setBrowserChipsData([]);
        setViewportChipsData([]);
        setPlatformChipsData([]);
        setAcceptedStatusChipsData([]);
    };

    const liveRegionText = activeStatusLabels.length > 0
        ? `Active statuses: ${activeStatusLabels.join(', ')}`
        : 'No statuses selected';

    const statusButtons = (
        <Group
            role="group"
            aria-label="Filter tests by status"
            gap={4}
            wrap="nowrap"
        >
            {statuses.map((status) => {
                const isActive = resolvedActiveStatuses.includes(status.key);
                const ariaLabel = isActive
                    ? `${status.label} status — active. Click to hide ${status.label.toLowerCase()} tests.`
                    : `${status.label} status — inactive. Click to show ${status.label.toLowerCase()} tests.`;
                const tooltipLabel = `Show/hide ${status.label}`;
                return (
                    <Tooltip
                        key={status.key}
                        label={tooltipLabel}
                        openDelay={300}
                        withinPortal
                    >
                        <UnstyledButton
                            role="switch"
                            aria-checked={isActive}
                            aria-label={ariaLabel}
                            title={ariaLabel}
                            data-test={`table-quick-filter-status-${status.key}`}
                            onClick={() => handleStatusToggle(status.key)}
                            style={{
                                width: 22,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 6,
                            }}
                        >
                            <Box
                                style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: 4,
                                    backgroundColor: status.color,
                                    opacity: isActive ? 1 : 0.28,
                                    border: isActive ? 'none' : `1px solid ${status.color}`,
                                }}
                            />
                        </UnstyledButton>
                    </Tooltip>
                );
            })}
        </Group>
    );

    const rightSection = (
        <Group gap={2} wrap="nowrap" pr={4}>
            {statusButtons}
            <ActionIcon
                title="Reset quick filter"
                aria-label="Reset quick filter"
                variant="transparent"
                color="gray"
                size="sm"
                onClick={resetQuickFilter}
            >
                <IconX size={16} stroke={1} />
            </ActionIcon>
        </Group>
    );

    return (
        <Box
            className={className}
            role="search"
            aria-label="Quick filter tests"
        >
            <style>{`
                @media (max-width: 1024px) {
                    .syngrisi-quick-filter { display: none; }
                }
            `}</style>
            <Group
                className="syngrisi-quick-filter"
                gap={10}
                wrap="nowrap"
                align="center"
                style={{ padding: 0 }}
            >
                <Popover
                    width={330}
                    position="bottom"
                    withArrow
                    shadow="md"
                    opened={opened}
                    onClose={close}
                >
                    <Group gap={0} wrap="nowrap">
                        <TextInput
                            value={resolvedSearchValue}
                            data-test="table-quick-filter"
                            aria-label="Quick filter by test name"
                            title={searchPlaceholder}
                            onChange={(event) => handleSearchChange(event.currentTarget.value)}
                            placeholder={searchPlaceholder}
                            size="xs"
                            radius="xs"
                            rightSection={rightSection}
                            rightSectionWidth={108}
                            rightSectionPointerEvents="auto"
                            style={{ width: 400 }}
                            styles={{
                                input: {
                                    width: '400px',
                                    height: 36,
                                    minHeight: 36,
                                    paddingRight: 116,
                                    fontSize: '13px',
                                    fontWeight: 400,
                                    letterSpacing: '-0.01em',
                                },
                            }}
                        />
                        <Popover.Target>
                            <ActionIcon
                                ml={6}
                                title="Open quick filter options"
                                aria-label="Open quick filter options"
                                aria-expanded={opened}
                                variant="transparent"
                                color="gray"
                                size="sm"
                                onClick={toggle}
                            >
                                <IconChevronDown size={16} stroke={1} />
                            </ActionIcon>
                        </Popover.Target>
                    </Group>
                    <Popover.Dropdown p="md">
                        <ScrollArea style={{ height: '45vh' }}>
                            <Stack gap={8} justify="flex-start">
                                <Text {...sectionLabelProps}>Browsers:</Text>
                                <Chip.Group gap={4} multiple value={browserChipsData} onChange={setBrowserChipsData}>
                                    <Box style={chipsRowStyle}>
                                        {browsers.map((item: string) => (
                                            <Chip value={item} key={item} styles={chipStyles}>{item}</Chip>
                                        ))}
                                    </Box>
                                </Chip.Group>

                                <Text {...sectionLabelProps}>Platforms:</Text>
                                <Chip.Group gap={4} multiple value={platformChipsData} onChange={setPlatformChipsData}>
                                    <Box style={chipsRowStyle}>
                                        {platforms.map((item: string) => (
                                            <Chip key={item} value={item} styles={chipStyles}>{item}</Chip>
                                        ))}
                                    </Box>
                                </Chip.Group>

                                <Text {...sectionLabelProps}>Viewports:</Text>
                                <Chip.Group value={viewportChipsData} onChange={setViewportChipsData} gap={4} multiple>
                                    <Box style={chipsRowStyle}>
                                        {viewports.map((item: string) => (
                                            <Chip value={item} key={item} styles={chipStyles}>{item}</Chip>
                                        ))}
                                    </Box>
                                </Chip.Group>

                                <Text {...sectionLabelProps}>Status:</Text>
                                <Chip.Group value={resolvedActiveStatuses} onChange={handleStatusesChange} gap={4} multiple>
                                    <Box style={chipsRowStyle}>
                                        {statuses.map((status) => (
                                            <Chip value={status.key} key={status.key} styles={chipStyles}>{status.label}</Chip>
                                        ))}
                                    </Box>
                                </Chip.Group>

                                <Text {...sectionLabelProps}>Accepted:</Text>
                                <Chip.Group value={acceptedStatusChipsData} onChange={setAcceptedStatusChipsData} gap={4} multiple>
                                    <Box style={chipsRowStyle}>
                                        {acceptStatuses.map((item: string) => (
                                            <Chip value={item} key={item} styles={chipStyles}>{item}</Chip>
                                        ))}
                                    </Box>
                                </Chip.Group>
                            </Stack>
                        </ScrollArea>
                        <Divider />
                        <Group justify="center" pt={16}>
                            <Button
                                size="xs"
                                styles={{ label: { fontSize: '12px', fontWeight: 600, letterSpacing: '0.01em' } }}
                                onClick={resetQuickFilter}
                            >
                                Reset
                            </Button>
                            <Button
                                size="xs"
                                styles={{ label: { fontSize: '12px', fontWeight: 600, letterSpacing: '0.01em' } }}
                                onClick={close}
                            >
                                Close
                            </Button>
                        </Group>
                    </Popover.Dropdown>
                </Popover>
                <VisuallyHidden aria-live="polite">{liveRegionText}</VisuallyHidden>
            </Group>
        </Box>
    );
}
