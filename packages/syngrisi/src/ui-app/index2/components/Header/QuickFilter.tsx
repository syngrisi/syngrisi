/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import {
    ActionIcon,
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
import { createStyles } from '@mantine/styles';
import { useDistinctQuery } from '../../../shared/hooks/useDistinctQuery';
import { escapeRegExp } from '../../../shared/utils/utils';
import { useParams } from '../../hooks/useParams';

const chipStyles: any = {
    label: {
        maxWidth: '9em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
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

    const useStyles = createStyles(
        () => (
            {
                quickFilter: {
                    '@media (max-width: 1024px)': {
                        display: 'none',
                    },
                },
            }
        ),
    );

    const { classes } = useStyles();

    return (
        <Group className={classes.quickFilter}>
            <Text size={14}>Quick Filter: </Text>
            <TextInput
                value={quickFilter}
                data-test="table-quick-filter"
                onChange={(event) => setQuickFilter(event.currentTarget.value)}
                size="xs"
                radius="xs"
                placeholder="Enter test name"
                rightSection={
                    (
                        <ActionIcon
                            title="clear filter"
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
                            spacing={0}
                            position="center"
                            // onClick={zoomPopoverHandler.toggle}
                        >
                            <ActionIcon
                                ml={-14}
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
                            <Stack spacing={8} justify="flex-start">
                                <Text size={10} color="gray.6" weight={600} transform="uppercase">Browsers:</Text>
                                <Chip.Group
                                    spacing={4}
                                    multiple
                                    value={browserChipsData}
                                    onChange={setBrowserChipsData}
                                >
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
                                </Chip.Group>

                                <Text size={10} color="gray.6" weight={600} transform="uppercase">Platforms:</Text>
                                <Chip.Group
                                    spacing={4}
                                    multiple
                                    value={platformChipsData}
                                    onChange={setPlatformChipsData}
                                >
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
                                </Chip.Group>

                                <Text size={10} color="gray.6" weight={600} transform="uppercase">Viewports:</Text>
                                <Chip.Group
                                    value={viewportChipsData}
                                    onChange={setViewportChipsData}
                                    spacing={4}
                                    multiple
                                >
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
                                </Chip.Group>

                                <Text size={10} color="gray.6" weight={600} transform="uppercase">Status:</Text>
                                <Chip.Group
                                    value={statusesChipsData}
                                    onChange={setStatusesChipsData}
                                    spacing={4}
                                    multiple
                                >
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
                                </Chip.Group>

                                <Text size={10} color="gray.6" weight={600} transform="uppercase">Accepted:</Text>
                                <Chip.Group
                                    value={acceptedStatusChipsData}
                                    onChange={setAcceptedStatusChipsData}
                                    spacing={4}
                                    multiple
                                >
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
                                </Chip.Group>

                            </Stack>
                        </ScrollArea>
                        <Divider />
                        <Group position="center" pt={16}>
                            <Button onClick={resetQuickFilter}>Reset</Button>
                            <Button onClick={close}>Close</Button>
                        </Group>
                    </Popover.Dropdown>
                </Popover>
            </div>
        </Group>
    );
}
