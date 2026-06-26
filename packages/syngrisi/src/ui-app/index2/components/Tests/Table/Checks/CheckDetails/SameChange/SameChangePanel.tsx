import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Box, Group, Text, Image, Tooltip, Badge, Button,
} from '@mantine/core';
import config from '@config';
import { useParams } from '@hooks/useParams';

type Sibling = {
    checkId: string;
    viewport: string;
    distance: number;
    confidence: number;
    name?: string;
    diffFilename?: string;
};

/**
 * "The same change at other resolutions" — soft re-rank suggestions for the current check.
 * Lists the best matching failed check per other viewport (gated server-side). "Show all in
 * table" filters the standard table to this set, where the existing batch actions apply.
 */
export function SameChangePanel({ checkId }: { checkId?: string }) {
    const { setQuery } = useParams();
    const { data } = useQuery({
        queryKey: ['check-siblings', checkId],
        enabled: !!checkId,
        queryFn: async () => {
            const r = await fetch(`${config.baseUri}/v1/checks/${checkId}/siblings`, { credentials: 'include' });
            if (!r.ok) return { results: [] };
            return r.json();
        },
    });

    const results: Sibling[] = data?.results || [];
    if (!checkId || results.length === 0) return null;

    const showInTable = () => {
        const ids = [checkId, ...results.map((r) => r.checkId)];
        setQuery({ quick_filter: { _id: { $in: ids } } });
    };

    return (
        <Box
            data-test="same-change-panel"
            p="xs"
            style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}
        >
            <Group justify="space-between" mb={6}>
                <Text fw={600} fz="sm">The same change at other resolutions</Text>
                <Button
                    size="compact-xs"
                    variant="light"
                    data-test="same-change-show-in-table"
                    onClick={showInTable}
                >
                    Show all in table
                </Button>
            </Group>
            <Group gap={10} wrap="wrap">
                {results.map((r) => (
                    <Tooltip
                        key={r.checkId}
                        label={`${r.viewport} · confidence ${Math.round(r.confidence * 100)}%`}
                        withinPortal
                    >
                        <Box data-test="same-change-item" data-viewport={r.viewport} style={{ width: 124 }}>
                            {r.diffFilename && (
                                <Image
                                    src={`${config.baseUri}/snapshoots/${r.diffFilename}`}
                                    h={72}
                                    fit="contain"
                                    style={{ background: '#fff', borderRadius: 6, border: '1px solid var(--mantine-color-default-border)' }}
                                />
                            )}
                            <Group gap={4} justify="space-between" mt={2} wrap="nowrap">
                                <Text fz={10} c="dimmed">{r.viewport}</Text>
                                <Badge size="xs" variant="light" color="blue">{Math.round(r.confidence * 100)}%</Badge>
                            </Group>
                        </Box>
                    </Tooltip>
                ))}
            </Group>
        </Box>
    );
}
