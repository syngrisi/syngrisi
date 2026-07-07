import { Button, Group, Modal, Text } from '@mantine/core';
import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TestsService } from '@shared/services';
import { errorMsg, successMsg } from '@shared/utils/utils';
import { log } from '@shared/utils/Logger';
import { useSimilar } from '@hooks/useSimilar';
import { useParams } from '@hooks/useParams';

interface Props {
    opened: boolean,
    setOpened: any,
    selection: any
    infinityQuery: any
    setSelection: any
}

export default function AcceptTestModalAsk({ opened, setOpened, selection, setSelection, infinityQuery }: Props) {
    const queryClient = useQueryClient();
    const { similarTo, ids } = useSimilar();
    const { query } = useParams();

    // When the grid is filtered to a subset of checks (AI-match / similar view,
    // or a triage "_idIn" set), accept must be scoped to exactly those checks —
    // otherwise the whole test (including the hidden, non-matching checks) would
    // be accepted. The server intersects this set with each test's own checks.
    const scopedCheckIds: string[] | undefined = similarTo
        ? ids
        : (Array.isArray(query.checkFilter?._idIn) ? query.checkFilter._idIn.map(String) : undefined);

    const mutationAcceptTest = useMutation(
        {
            mutationFn: (data: { id: string; checkIds?: string[] }) => TestsService.acceptTest(data),
            onSuccess: async (resp) => {
                successMsg({ message: 'Test has been successfully accepted' });
                await queryClient.invalidateQueries({ queryKey: ['preview_checks', resp.id] });
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
        // eslint-disable-next-line no-restricted-syntax
        for (const id of selection) {
            asyncMutations.push(mutationAcceptTest.mutateAsync({ id, checkIds: scopedCheckIds }));
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
            <Group justify="flex-end">
                <Button
                    data-test="accept-test-confirm-button"
                    aria-label="Accept"
                    onClick={
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
