/* eslint-disable no-underscore-dangle */
import { Button, Group, Modal, Text } from '@mantine/core';
import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { errorMsg, successMsg } from '@shared/utils/utils';
import { log } from '@shared/utils/Logger';
import { SuitesService } from '@shared/services';
import { useParams } from '@hooks/useParams';

interface Props {
    opened: boolean,
    setOpened: any,
    infinityQuery: any,
    item: any,
}

export default function RemoveSuiteModalAsk({ opened, setOpened, infinityQuery, item }: Props) {
    const { setQuery } = useParams();
    const mutationRemoveItem = useMutation(
        (data: { id: string }) => SuitesService.remove(data),
        {
            onSuccess: async () => {
                setQuery({ base_filter: undefined });
                successMsg({ message: 'Suite has been successfully removed' });
            },
            onError: (e: any) => {
                errorMsg({ error: 'Cannot remove the Suite' });
                log.error(e);
            },
        },
    );
    const handleRemoveButtonClick = async () => {
        await mutationRemoveItem.mutateAsync({ id: item._id });
        infinityQuery.refetch();
        setOpened(false);
    };
    return (
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Remove this suite?"
        >
            <Text size="sm">
                Are you sure you want to permanently delete the Suite?
            </Text>
            <Group position="right">
                <Button
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
