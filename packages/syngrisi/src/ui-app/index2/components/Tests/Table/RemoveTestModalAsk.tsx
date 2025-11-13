import { Button, Group, Modal, Text } from '@mantine/core';
import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { TestsService } from '@shared/services';
import { errorMsg, successMsg } from '@shared/utils/utils';
import { log } from '@shared/utils/Logger';

interface Props {
    opened: boolean,
    setOpened: any,
    selection: any
    infinityQuery: any
    setSelection: any
}

export default function RemoveTestModalAsk({ opened, setOpened, selection, setSelection, infinityQuery }: Props) {
    const mutationRemoveTest = useMutation(
        (data: { id: string }) => TestsService.removeTest(data),
        {
            onSuccess: async () => {
                successMsg({ message: 'Test has been successfully removed' });
            },
            onError: (e: any) => {
                errorMsg({ error: 'Cannot remove the Test' });
                log.error(e);
            },
        },
    );
    // const [foldMode, toggleFoldMode] = useToggle([true, false]);
    const asyncMutations: Promise<any>[] = [];
    const handleRemoveButtonClick = async () => {
        // eslint-disable-next-line no-restricted-syntax
        for (const id of selection) {
            asyncMutations.push(mutationRemoveTest.mutateAsync({ id }));
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
            title="Remove selected tests?"
        >
            <Text size="sm">
                Are you sure you want to permanently delete the selected tests?
            </Text>
            <Group position="right">
                <Button
                    data-test="confirm-remove-test-icon"
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
