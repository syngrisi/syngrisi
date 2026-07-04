/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line */
import { Button, Group, Modal, Text } from '@mantine/core';
import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { errorMsg, successMsg } from '@shared/utils/utils';
import { log } from '@shared/utils/Logger';
import { RunsService } from '@shared/services';

interface Props {
    opened: boolean,
    setOpened: any,
    item: any,
}

export default function PromoteBaselinesModalAsk({ opened, setOpened, item }: Props) {
    const promotingMutation = useMutation(
        {
            mutationFn: (data: { runId: string }) => RunsService.promoteBaselines(data),
            onSuccess: async (result: any) => {
                successMsg({ message: `Promoted ${result?.promoted ?? 0} baseline(s) to ${result?.toBranch ?? 'the main branch'}` });
            },
            onError: (e: any) => {
                errorMsg({ error: e?.message || 'Cannot promote baselines' });
                log.error(e);
            },
        },
    );
    const handlePromoteButtonClick = async () => {
        await promotingMutation.mutateAsync({ runId: item._id });
        setOpened(false);
    };
    return (
        <Modal
            data-test="promote-baselines-modal"
            opened={opened}
            onClose={() => setOpened(false)}
            title="Promote baselines to main?"
        >
            <Text size="sm">
                This will promote all accepted baselines of this run&apos;s branch(es) to the project&apos;s main
                branch, so they become the main-branch baselines.
            </Text>
            <Group justify="flex-end" mt="md">
                <Button
                    data-test="run-promote-confirm"
                    loading={promotingMutation.isPending}
                    onClick={
                        async () => {
                            await handlePromoteButtonClick();
                        }
                    }
                >
                    Promote
                </Button>
                <Button variant="outline" onClick={() => setOpened(false)}>Cancel</Button>
            </Group>
        </Modal>
    );
}
