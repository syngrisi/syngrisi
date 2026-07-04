import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
    Modal, Stack, Group, Text, Image, Slider, ActionIcon, Loader, Center,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import * as dateFns from 'date-fns';
import config from '@config';
import { BaselineHistoryService, BaselineHistoryIdent } from '@shared/services/baselineHistory.service';

interface HistoryModalProps {
    opened: boolean;
    onClose: () => void;
    ident: BaselineHistoryIdent;
    baselineName: string;
}

// "Time machine": scrub through a check's accepted-baseline history over time, with an optional
// AI-generated summary of what changed between consecutive baselines.
export function HistoryModal({ opened, onClose, ident, baselineName }: HistoryModalProps) {
    const [index, setIndex] = useState(0);

    const historyQuery = useQuery({
        queryKey: ['baselineHistory', ident],
        queryFn: () => BaselineHistoryService.getHistory(ident),
        enabled: opened,
    });

    const items = historyQuery.data || [];

    useEffect(() => {
        if (opened && items.length > 0) {
            setIndex(items.length - 1);
        }
    }, [opened, items.length]);

    const current = items[index];
    const previous = index > 0 ? items[index - 1] : undefined;

    const summaryQuery = useQuery({
        queryKey: ['baselineHistorySummary', previous?.id, current?.id],
        queryFn: () => BaselineHistoryService.getSummary(previous!.id, current!.id),
        enabled: Boolean(opened && previous && current),
    });

    const marks = useMemo(
        () => items.map((item, i) => ({
            value: i,
            label: dateFns.format(new Date(item.createdDate), 'MMM d'),
        })),
        [items]
    );

    const handleClose = () => {
        setIndex(0);
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={`History: ${baselineName}`}
            centered
            size="lg"
            data-test="history-modal"
        >
            <Stack gap="md">
                {historyQuery.isLoading && (
                    <Center h={200}><Loader size="sm" /></Center>
                )}
                {historyQuery.isError && (
                    <Text c="red">Failed to load baseline history</Text>
                )}
                {!historyQuery.isLoading && items.length === 0 && (
                    <Text c="dimmed">No accepted baselines found for this check</Text>
                )}
                {current && (
                    <>
                        <Group justify="center" align="center" wrap="nowrap" gap="xs">
                            <ActionIcon
                                variant="subtle"
                                aria-label="Previous baseline"
                                data-test="history-prev"
                                disabled={index === 0}
                                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                            >
                                <IconChevronLeft size={18} />
                            </ActionIcon>
                            <Image
                                src={current.imageUrl ? `${config.baseUri}${current.imageUrl}` : ''}
                                fit="contain"
                                mah={360}
                                data-test="history-image"
                            />
                            <ActionIcon
                                variant="subtle"
                                aria-label="Next baseline"
                                data-test="history-next"
                                disabled={index === items.length - 1}
                                onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
                            >
                                <IconChevronRight size={18} />
                            </ActionIcon>
                        </Group>

                        <Text size="sm" ta="center" c="dimmed" data-test="history-date">
                            {dateFns.format(new Date(current.createdDate), 'yyyy-MM-dd HH:mm:ss')}
                            {current.markedByUsername ? ` · accepted by ${current.markedByUsername}` : ''}
                        </Text>

                        {items.length > 1 && (
                            <Slider
                                value={index}
                                onChange={setIndex}
                                min={0}
                                max={items.length - 1}
                                step={1}
                                marks={marks}
                                label={(value) => (items[value]
                                    ? dateFns.format(new Date(items[value].createdDate), 'MMM d, yyyy')
                                    : '')}
                                data-test="history-slider"
                            />
                        )}

                        {previous && (
                            <Stack gap={4} mt="md" data-test="history-summary">
                                {summaryQuery.isLoading && <Loader size="xs" />}
                                {summaryQuery.data?.summary && (
                                    <Text size="sm">{summaryQuery.data.summary}</Text>
                                )}
                            </Stack>
                        )}
                    </>
                )}
            </Stack>
        </Modal>
    );
}
