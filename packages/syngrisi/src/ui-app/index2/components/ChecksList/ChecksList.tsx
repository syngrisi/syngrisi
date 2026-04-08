import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import {
    Card,
    Group,
    Image,
    Stack,
    Text,
    Title,
    UnstyledButton,
    SegmentedControl,
    ScrollArea,
    Tooltip,
    Box,
    Badge,
} from '@mantine/core';
import * as dateFns from 'date-fns';
import { GenericService } from '@shared/services';
import { Status } from '@shared/components/Check/Status';
import { ViewPortLabel } from '@index/components/Tests/Table/Checks/ViewPortLabel';
import { sizes } from '@index/components/Tests/Table/Checks/checkSizes';
import { AcceptButton } from '@index/components/Tests/Table/Checks/AcceptButton';
import { RemoveButton } from '@index/components/Tests/Table/Checks/RemoveButton';
import { CheckModal } from '@index/components/Tests/Table/Checks/CheckModal';
import config from '@config';
import { BrowserIcon } from '@shared/components/Check/BrowserIcon';
import { OsIcon } from '@shared/components/Check/OsIcon';

export function ChecksList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const checkName = searchParams.get('name');
    const apiKey = searchParams.get('apikey');
    const [previewSize, setPreviewSize] = React.useState('medium');

    const previewHeights = {
        small: 100,
        large: 600,
        medium: 400,
    };

    const getPreviewHeight = (size: string) => previewHeights[size as keyof typeof previewHeights] || 400;

    const checksQuery = useQuery(
        {
            queryKey: ['checks_list', checkName],
            queryFn: () => GenericService.get(
                'checks',
                { name: checkName },
                {
                    populate: 'baselineId,actualSnapshotId,diffId',
                    limit: '5',
                    sortBy: 'createdDate:desc',
                    apikey: apiKey,
                },
                'checksListQuery',
            ),
            enabled: !!checkName,
            refetchOnWindowFocus: false,
        },
    );

    if (!checkName) {
        return <Text>Please provide a check name in the URL query parameter, e.g. ?name=test123</Text>;
    }

    if (checksQuery.isLoading) {
        return <Text>Loading...</Text>;
    }

    if (checksQuery.isError) {
        return <Text c="red">Error loading checks</Text>;
    }

    if (!checksQuery.data?.results?.length) {
        return (
            <Text>
                No checks found with name:
                {checkName}
            </Text>
        );
    }

    return (
        <Stack p="md" h="100vh">
            <Group justify="space-between">
                <Title order={2} style={{ maxWidth: '80%' }}>
                    <Text truncate>
                        Latest for:
                        {' '}
                        {checkName}
                    </Text>
                </Title>
                <SegmentedControl
                    value={previewSize}
                    onChange={setPreviewSize}
                    data={[
                        {
                            value: 'small',
                            label: (
                                <Group gap={4}>
                                    <Text size="sm">S</Text>
                                </Group>
                            ),
                        },
                        {
                            value: 'medium',
                            label: (
                                <Group gap={4}>
                                    <Text size="sm">M</Text>
                                </Group>
                            ),
                        },
                        {
                            value: 'large',
                            label: (
                                <Group gap={4}>
                                    <Text size="sm">L</Text>
                                </Group>
                            ),
                        },
                    ]}
                />
            </Group>
            <ScrollArea
                h="calc(100vh - 80px)"
                offsetScrollbars
                styles={{ viewport: { paddingRight: 10 } }}
            >
                <Stack>
                    {checksQuery.data.results.map((check: any) => {
                        const imageFilename = check.diffId?.filename
                            || check.actualSnapshotId?.filename
                            || check.baselineId?.filename;
                        const imagePreviewSrc = `${config.baseUri}/snapshoots/${imageFilename}`;

                        return (
                            <Card key={check.id} shadow="sm" p="md" style={{ maxWidth: '900px' }}>
                                <Group justify="space-between">
                                    <Group justify="flex-start" mb="xs" mt="xs" gap={4}>
                                        <Tooltip
                                            withinPortal
                                            label={dateFns.format(new Date(check.createdDate), 'yyyy-MM-dd HH:mm:ss')}
                                        >
                                            <Text size="sm" c="dimmed">
                                                {dateFns.formatDistanceToNow(new Date(check.createdDate))}
                                                &nbsp;ago
                                            </Text>
                                        </Tooltip>
                                    </Group>
                                    <Group justify="flex-end">
                                        <OsIcon os={check.os} size={19} />
                                        <Box style={{ marginTop: 2 }}>
                                            <BrowserIcon browser={check.browserName} size={16} />
                                        </Box>
                                        <Badge
                                            size="xs"
                                            color="yellow"
                                            radius="xs"
                                            variant="outline"
                                            title={`Version of browser: ${check.browserVersion}`}
                                        >
                                            <Text size="xs" c="dimmed">
                                                {check.browserVersion ? `${check.browserVersion}` : ''}
                                            </Text>
                                        </Badge>

                                        <Status check={check} />
                                        <ViewPortLabel
                                            check={check}
                                            sizes={sizes}
                                            color="blue"
                                            checksViewSize="medium"
                                        />
                                    </Group>
                                </Group>
                                <Group justify="center">
                                    <Group
                                        gap={4}
                                        justify="center"
                                        style={{
                                            backgroundColor: '#f0f8ff',
                                            borderTopRightRadius: '4px',
                                            borderTopLeftRadius: '4px',
                                            // borderBottomRightRadius: '6px',
                                            // borderBottomLeftRadius: '6px',
                                            padding: '4px',
                                        }}
                                    >
                                        <AcceptButton
                                            check={check}
                                            testUpdateQuery={checksQuery}
                                            checksQuery={checksQuery}
                                            size={19}
                                        />
                                        <RemoveButton check={check} testUpdateQuery={checksQuery} size={24} />
                                    </Group>
                                </Group>
                                <Stack>
                                    <UnstyledButton
                                        onClick={() => {
                                            setSearchParams((prev) => {
                                                prev.set('checkId', check.id);
                                                prev.set('modalIsOpen', 'true');
                                                return prev;
                                            });
                                        }}
                                        w="100%"
                                    >

                                        <Image
                                            src={imagePreviewSrc}
                                            h={getPreviewHeight(previewSize)}
                                            fit="contain"
                                            alt={check.name}
                                        />
                                    </UnstyledButton>
                                </Stack>

                            </Card>
                        );
                    })}
                </Stack>
            </ScrollArea>
            <CheckModal
                relatedRendered={false}
                apikey={apiKey}
            />
        </Stack>
    );
}
