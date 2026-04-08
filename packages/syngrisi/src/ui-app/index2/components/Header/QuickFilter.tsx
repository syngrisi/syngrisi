/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import {
    ActionIcon,
    Box,
    Chip,
    Group,
    Popover,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    useMantineTheme,
    Button,
    Divider,
} from '@mantine/core';
import { IconChevronDown, IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useClickOutside, useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { useDistinctQuery } from '@shared/hooks/useDistinctQuery';
import { escapeRegExp } from '@shared/utils/utils';
import { useParams } from '@hooks/useParams';

const chipStyles: any = {
    label: {
        maxWidth: '9em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};

const chipsRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
};

export function QuickFilter() {
    const theme = useMantineTheme();
    const { setQuery } = useParams();

    const [opened, { toggle, close }] = useDisclosure(false);
    const ref = useClickOutside(() => close());
    const [quickFilter, setQuickFilter] = useState<string>('');
    const [debouncedQuickFilter] = useDebouncedValue(quickFilter, 400);

    const [browserChipsData, setBrowserChipsData] = useState([]);
    const [viewportChipsData, setViewportChipsData] = useState([]);
    const [platformChipsData, setPlatformChipsData] = useState([]);
    const [statusesChipsData, setStatusesChipsData] = useState([]);
    const [acceptedStatusChipsData, setAcceptedStatusChipsData] = useState([]);
    const [branchChipsData, setBranchChipsData] = useState([]);

    const browsersData = useDistinctQuery(
        {
            resource: 'test-distinct/browserName',
        },
    ).data;

    const viewportData = useDistinctQuery(
        {
            resource: 'test-distinct/viewport',
        },
    ).data;

    const platformData = useDistinctQuery(
        {
            resource: 'test-distinct/os',
        },
    ).data;

    const statusesData = useDistinctQuery(
        {
            resource: 'test-distinct/status',
        },
    ).data;

    const acceptStatusesData = useDistinctQuery(
        {
            resource: 'test-distinct/markedAs',
        },
    ).data;

    const getDistinctItems = (data: any) => (data?.results?.length! > 0 ? data?.results?.map((x: any) => x.name) : []);
    const browsers = useMemo(() => getDistinctItems(browsersData), [browsersData?.results.length]);
    const viewports = useMemo(() => getDistinctItems(viewportData), [viewportData?.results.length]);
    const platforms = useMemo(() => getDistinctItems(platformData), [platformData?.results.length]);
    const statuses = useMemo(() => getDistinctItems(statusesData), [statusesData?.results.length]);
    const acceptStatuses = useMemo(() => getDistinctItems(acceptStatusesData), [acceptStatusesData?.results.length]);

    const quickFilterObject: any = useMemo(
        () => {
            const arr = [];
            if (debouncedQuickFilter) {
                arr.push({
                    name: {
                        $regex: escapeRegExp(debouncedQuickFilter),
                        $options: 'im',
                    },
                });
            }
            if (browserChipsData.length > 0) arr.push({ browserName: { $in: browserChipsData } });
            if (platformChipsData.length > 0) arr.push({ os: { $in: platformChipsData } });
            if (viewportChipsData.length > 0) arr.push({ viewport: { $in: viewportChipsData } });
            if (statusesChipsData.length > 0) arr.push({ status: { $in: statusesChipsData } });
            if (acceptedStatusChipsData.length > 0) arr.push({ markedAs: { $in: acceptedStatusChipsData } });
            if (arr.length < 1) return {};
            return { $and: arr };
        }, [
            debouncedQuickFilter,
            browserChipsData.length,
            viewportChipsData.length,
            platformChipsData.length,
            statusesChipsData.length,
            acceptedStatusChipsData.length,
        ],
    );

    useEffect(function setQuickFilterQuery() {
        setQuery({ quick_filter: quickFilterObject });
    }, [JSON.stringify(quickFilterObject)]);

    // console.log(JSON.stringify(quickFilterObject, null, '..'))

    const resetQuickFilter = () => {
        setQuickFilter('');
        setBrowserChipsData([]);
        setViewportChipsData([]);
        setPlatformChipsData([]);
        setStatusesChipsData([]);
        setAcceptedStatusChipsData([]);
        setBranchChipsData([]);
    };

    return (
        <Group className="syngrisi-quick-filter">
            <style>{`
                @media (max-width: 1024px) {
                    .syngrisi-quick-filter { display: none; }
                }
            `}</style>
            <Text fz={14}>Quick Filter: </Text>
            <TextInput
                value={quickFilter}
                data-test="table-quick-filter"
                aria-label="Quick filter by test name"
                onChange={(event) => setQuickFilter(event.currentTarget.value)}
                size="xs"
                radius="xs"
                placeholder="Enter test name"
                rightSection={
                    (
                        <ActionIcon
                            title="clear filter"
                            aria-label="Clear quick filter"
                            variant="transparent"
                            color="gray"
                            onClick={() => {
                                resetQuickFilter();
                            }}
                        >
                            <IconX stroke={1} color={theme.colors.gray[5]} />
                        </ActionIcon>
                    )
                }
                styles={{
                    input: { width: '300px' },
                }}
            />
            <div ref={ref}>

                <Popover
                    width={330}
                    position="bottom"
                    withArrow
                    shadow="md"
                    opened={opened}
                >
                    <Popover.Target>
                        <Group
                            gap={0}
                            justify="center"
                            // onClick={zoomPopoverHandler.toggle}
                        >
                            <ActionIcon
                                ml={-14}
                                aria-label="Open quick filter options"
                                aria-expanded={opened}
                                variant="transparent"
                                color="gray"
                                onClick={toggle}
                            >
                                <IconChevronDown size={16} />
                            </ActionIcon>
                        </Group>
                    </Popover.Target>
                    <Popover.Dropdown
                        p="md"
                    >
                        <ScrollArea
                            style={{ height: '45vh' }}
                        >
                            <Stack gap={8} justify="flex-start">
                                <Text fz={10} c="gray.6" fw={600} tt="uppercase">Browsers:</Text>
                                <Chip.Group
                                    gap={4}
                                    multiple
                                    value={browserChipsData}
                                    onChange={setBrowserChipsData}
                                >
                                    <Box style={chipsRowStyle}>
                                        {
                                            browsers.map((item: string) => (
                                                <Chip
                                                    value={item}
                                                    key={item}
                                                    styles={chipStyles}
                                                >
                                                    {item}
                                                </Chip>
                                            ))
                                        }
                                    </Box>
                                </Chip.Group>

                                <Text fz={10} c="gray.6" fw={600} tt="uppercase">Platforms:</Text>
                                <Chip.Group
                                    gap={4}
                                    multiple
                                    value={platformChipsData}
                                    onChange={setPlatformChipsData}
                                >
                                    <Box style={chipsRowStyle}>
                                        {
                                            platforms.map((item: string) => (
                                                <Chip
                                                    key={item}
                                                    value={item}
                                                    styles={chipStyles}
                                                >
                                                    {item}
                                                </Chip>
                                            ))
                                        }
                                    </Box>
                                </Chip.Group>

                                <Text fz={10} c="gray.6" fw={600} tt="uppercase">Viewports:</Text>
                                <Chip.Group
                                    value={viewportChipsData}
                                    onChange={setViewportChipsData}
                                    gap={4}
                                    multiple
                                >
                                    <Box style={chipsRowStyle}>
                                        {
                                            viewports.map((item: string) => (
                                                <Chip
                                                    value={item}
                                                    key={item}
                                                    styles={chipStyles}
                                                >
                                                    {item}
                                                </Chip>
                                            ))
                                        }
                                    </Box>
                                </Chip.Group>

                                <Text fz={10} c="gray.6" fw={600} tt="uppercase">Status:</Text>
                                <Chip.Group
                                    value={statusesChipsData}
                                    onChange={setStatusesChipsData}
                                    gap={4}
                                    multiple
                                >
                                    <Box style={chipsRowStyle}>
                                        {
                                            statuses.map((item: string) => (
                                                <Chip
                                                    value={item}
                                                    key={item}
                                                    styles={chipStyles}
                                                >
                                                    {item}
                                                </Chip>
                                            ))
                                        }
                                    </Box>
                                </Chip.Group>

                                <Text fz={10} c="gray.6" fw={600} tt="uppercase">Accepted:</Text>
                                <Chip.Group
                                    value={acceptedStatusChipsData}
                                    onChange={setAcceptedStatusChipsData}
                                    gap={4}
                                    multiple
                                >
                                    <Box style={chipsRowStyle}>
                                        {
                                            acceptStatuses.map((item: string) => (
                                                <Chip
                                                    value={item}
                                                    key={item}
                                                    styles={chipStyles}
                                                >
                                                    {item}
                                                </Chip>
                                            ))
                                        }
                                    </Box>
                                </Chip.Group>

                            </Stack>
                        </ScrollArea>
                        <Divider />
                        <Group justify="center" pt={16}>
                            <Button onClick={resetQuickFilter}>Reset</Button>
                            <Button onClick={close}>Close</Button>
                        </Group>
                    </Popover.Dropdown>
                </Popover>
            </div>
        </Group>
    );
}
