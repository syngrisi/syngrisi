import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
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
import { GenericService } from '../../../shared/services';
import { Status } from '../../../shared/components/Check/Status';
import { ViewPortLabel } from '../Tests/Table/Checks/ViewPortLabel';
import { sizes } from '../Tests/Table/Checks/checkSizes';
import { AcceptButton } from '../Tests/Table/Checks/AcceptButton';
import { RemoveButton } from '../Tests/Table/Checks/RemoveButton';
import { CheckModal } from '../Tests/Table/Checks/CheckModal';
import config from '../../../config';
import { BrowserIcon } from '../../../shared/components/Check/BrowserIcon';
import { OsIcon } from '../../../shared/components/Check/OsIcon';

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
        ['checks_list', checkName],
        () => GenericService.get(
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
        {
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
        return <Text color="red">Error loading checks</Text>;
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
            <Group position="apart">
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
                                <Group spacing={4}>
                                    <Text size="sm">S</Text>
                                </Group>
                            ),
                        },
                        {
                            value: 'medium',
                            label: (
                                <Group spacing={4}>
                                    <Text size="sm">M</Text>
                                </Group>
                            ),
                        },
                        {
                            value: 'large',
                            label: (
                                <Group spacing={4}>
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
                                <Group position="apart">
                                    <Group position="left" mb="xs" mt="xs">
                                        <Tooltip
                                            withinPortal
                                            label={dateFns.format(new Date(check.createdDate), 'yyyy-MM-dd HH:mm:ss')}
                                        >
                                            <Text size="sm" color="dimmed">
                                                {dateFns.formatDistanceToNow(new Date(check.createdDate))}
                                                &nbsp;ago
                                            </Text>
                                        </Tooltip>
                                    </Group>
                                    <Group position="right">
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
                                            <Text size="xs" color="dimmed">
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
                                <Group position="center" mb="xs">
                                    <Group spacing={4} position="center">
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
                                            height={getPreviewHeight(previewSize)}
                                            fit="contain"
                                            withPlaceholder
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
