import { Button, Group, Modal, Text } from '@mantine/core';
import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { GenericService } from '@shared/services';
import { errorMsg, successMsg } from '@shared/utils/utils';
import { log } from '@shared/utils/Logger';

interface Props {
    opened: boolean,
    setOpened: any,
    selection: any
    infinityQuery: any
    setSelection: any
}

export default function RemoveBaselineModalAsk({ opened, setOpened, selection, setSelection, infinityQuery }: Props) {
    const mutationRemove = useMutation(
        (id: string) => GenericService.delete('baselines', id),
        {
            onSuccess: async () => {
                successMsg({ message: 'Baseline has been successfully removed' });
            },
            onError: (e: any) => {
                errorMsg({ error: 'Cannot remove the Baseline' });
                log.error(e);
            },
        },
    );

    const asyncMutations: Promise<any>[] = [];
    const handleRemoveButtonClick = async () => {
        for (const id of selection) {
            asyncMutations.push(mutationRemove.mutateAsync(id));
        }
        await Promise.all(asyncMutations);
        setSelection(() => []);
        infinityQuery.refetch();
        setOpened(false);
    };
    return (
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Remove selected baselines?"
        >
            <Text size="sm">
                Are you sure you want to permanently delete the selected baselines?
            </Text>
            <Group position="right">
                <Button
                    data-test="confirm-remove-baseline-icon"
                    aria-label="Remove"
                    color="red"
                    onClick={
                        async () => {
                            await handleRemoveButtonClick();
                        }
                    }
                >
                    Remove
                </Button>
                <Button variant="outline" onClick={() => setOpened(false)}>Cancel</Button>
            </Group>
        </Modal>
    );
}
