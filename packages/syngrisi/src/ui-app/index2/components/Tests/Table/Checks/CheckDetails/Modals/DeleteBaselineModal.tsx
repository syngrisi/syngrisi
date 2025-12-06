import React from 'react';
import { Modal, Text, Button, Group, Stack, Anchor } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

interface DeleteBaselineModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    usageCount: number;
    snapshotId: string; // This is the Snapshot ID used as baseline
}

export const DeleteBaselineModal: React.FC<DeleteBaselineModalProps> = ({
    opened,
    onClose,
    onConfirm,
    usageCount,
    snapshotId,
}) => {
    return (
        <Modal opened={opened} onClose={onClose} title="Delete Baseline" centered>
            <Stack spacing="md">
                <Group noWrap align="flex-start">
                    <IconAlertTriangle size={40} color="red" style={{ minWidth: 40 }} />
                    <Stack spacing="xs">
                        <Text weight={500}>
                            Are you sure you want to delete this baseline?
                        </Text>
                        <Text size="sm" color="dimmed">
                            This baseline is used in{' '}
                            <Anchor
                                href={`/checks?filter=${encodeURIComponent(JSON.stringify({ baselineId: snapshotId }))}`}
                                target="_blank"
                            >
                                {usageCount} checks
                            </Anchor>.
                        </Text>
                    </Stack>
                </Group>

                <Group position="right" mt="md">
                    <Button variant="default" onClick={onClose}>Cancel</Button>
                    <Button color="red" onClick={onConfirm} data-test="confirm-delete-baseline">Delete</Button>
                </Group>
            </Stack>
        </Modal>
    );
};
