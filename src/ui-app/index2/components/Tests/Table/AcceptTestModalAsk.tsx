import { Button, Group, Modal, Text } from '@mantine/core';
import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { TestsService } from '../../../../shared/services';
import { errorMsg, successMsg } from '../../../../shared/utils/utils';
import { log } from '../../../../shared/utils/Logger';

interface Props {
    opened: boolean,
    setOpened: any,
    selection: any
    infinityQuery: any
    setSelection: any
}

export default function AcceptTestModalAsk({ opened, setOpened, selection, setSelection, infinityQuery }: Props) {
    const mutationAcceptTest = useMutation(
        (data: { id: string }) => TestsService.acceptTest(data),
        {
            onSuccess: async () => {
                successMsg({ message: 'Test has been successfully accepted' });
            },
            onError: (e: any) => {
                errorMsg({ error: 'Cannot accept the Test' });
                log.error(e);
            },
        },
    );
    // const [foldMode, toggleFoldMode] = useToggle([true, false]);
    const asyncMutations: Promise<any>[] = [];
    const handleAcceptButtonClick = async () => {
        for (const id of selection) {
            asyncMutations.push(mutationAcceptTest.mutateAsync({ id }));
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
            title="Accept selected tests?"
        >
            <Text size="sm">
                Are you sure you want to accept the selected tests?
            </Text>
            <Group position="right">
                <Button onClick={
                    async () => {
                        await handleAcceptButtonClick();
                    }
                }
                >
                    Accept
                </Button>
                <Button variant="outline" onClick={() => setOpened(false)}>Cancel</Button>
            </Group>
        </Modal>
    );
}
