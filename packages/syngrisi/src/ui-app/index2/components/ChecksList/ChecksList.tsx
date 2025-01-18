import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Card, Group, Image, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { GenericService } from '../../../shared/services';
import { Status } from '../../../shared/components/Check/Status';
import { ViewPortLabel } from '../Tests/Table/Checks/ViewPortLabel';
import { sizes } from '../Tests/Table/Checks/checkSizes';
import { AcceptButton } from '../Tests/Table/Checks/AcceptButton';
import { RemoveButton } from '../Tests/Table/Checks/RemoveButton';
import { CheckModal } from '../Tests/Table/Checks/CheckModal';
import config from '../../../config';

export function ChecksList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const checkName = searchParams.get('name');

    const checksQuery = useQuery(
        ['checks_list', checkName],
        () => GenericService.get(
            'checks',
            { name: checkName },
            {
                populate: 'baselineId,actualSnapshotId,diffId',
                limit: '5',
                sortBy: 'CreatedDate',
                sortOrder: -1,
            },
            'checksListQuery',
        ),
        {
            enabled: !!checkName,
            refetchOnWindowFocus: false,
        },
    );

    if (!checkName) {
        return (
            <Text>
                Please provide a check name in the URL query parameter, e.g. ?name=test123
            </Text>
        );
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
                {' '}
                {checkName}
            </Text>
        );
    }

    return (
        <Stack p="md">
            <Title order={2}>
                Latest Checks for:
                {' '}
                {checkName}
            </Title>
            <Stack>
                {checksQuery.data.results.map((check: any) => {
                    const imageFilename = check.diffId?.filename
                        || check.actualSnapshotId?.filename
                        || check.baselineId?.filename;
                    const imagePreviewSrc = `${config.baseUri}/snapshoots/${imageFilename}`;

                    return (
                        <Card key={check.id} shadow="sm" p="md">
                            <Group position="apart" mb="xs">
                                <Group>
                                    <Status check={check} />
                                    <ViewPortLabel
                                        check={check}
                                        sizes={sizes}
                                        color="blue"
                                        checksViewSize="medium"
                                    />
                                </Group>
                                <Group spacing={4}>
                                    <AcceptButton
                                        check={check}
                                        testUpdateQuery={checksQuery}
                                        checksQuery={checksQuery}
                                        size={19}
                                    />
                                    <RemoveButton
                                        check={check}
                                        testUpdateQuery={checksQuery}
                                        size={24}
                                    />
                                    <Text size="sm" color="dimmed">
                                        {new Date(check.createdDate).toLocaleString()}
                                    </Text>
                                </Group>
                            </Group>
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
                                    height={200}
                                    fit="contain"
                                    withPlaceholder
                                    alt={check.name}
                                />
                            </UnstyledButton>
                        </Card>
                    );
                })}
            </Stack>
            <CheckModal />
        </Stack>
    );
}
