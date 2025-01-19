import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Card, Group, Image, Stack, Text, Title, UnstyledButton, SegmentedControl, ScrollArea, Tooltip, Box } from '@mantine/core';
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
import * as dateFns from 'date-fns';

export function ChecksList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const checkName = searchParams.get('name');
    const apiKey = searchParams.get('apikey');
    const [previewSize, setPreviewSize] = React.useState('medium');

    const getPreviewHeight = (size: string) => {
        switch (size) {
            case 'small':
                return 100;
            case 'large':
                return 600;
            default:
                return 400;
        }
    };

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
                            <Card key={check.id} shadow="sm" p="md">
                                <Group position="center" mb="xs">
                                    <Group position="center" spacing="xs">
                                        <Tooltip
                                            withinPortal
                                            label={dateFns.format(new Date(check.createdDate), 'yyyy-MM-dd HH:mm:ss')}
                                        >
                                            <Text size="sm" color="dimmed">
                                                {dateFns.formatDistanceToNow(new Date(check.createdDate))}
                                                ago
                                            </Text>
                                        </Tooltip>
                                        <OsIcon os={check.os} size={19} />
                                        <Box style={{ marginTop: 2 }}>
                                            <BrowserIcon browser={check.browserName} size={16} />
                                        </Box>
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
                                    <Group spacing={4} position="center">
                                        <Status check={check} />
                                        <ViewPortLabel
                                            check={check}
                                            sizes={sizes}
                                            color="blue"
                                            checksViewSize="medium"
                                        />

                                        <AcceptButton
                                            check={check}
                                            testUpdateQuery={checksQuery}
                                            checksQuery={checksQuery}
                                            size={19}
                                        />
                                        <RemoveButton check={check} testUpdateQuery={checksQuery} size={24} />

                                    </Group>
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
