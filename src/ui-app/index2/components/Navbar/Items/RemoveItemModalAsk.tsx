/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line */
import { Button, Group, Modal, Text } from '@mantine/core';
import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { errorMsg, successMsg } from '../../../../shared/utils/utils';
import { log } from '../../../../shared/utils/Logger';
import { RunsService, SuitesService } from '../../../../shared/services';
import { useParams } from '../../../hooks/useParams';

interface Props {
    opened: boolean,
    setOpened: any,
    infinityQuery: any,
    type: string,
    item: any,
}

export default function RemoveItemModalAsk({ opened, setOpened, infinityQuery, item, type }: Props) {
    const servicesMap: any = {
        Run: RunsService,
        Suite: SuitesService,
    };
    const { setQuery } = useParams();
    const queryClient = useQueryClient();

    const removingMutation = useMutation(
        (data: { id: string }) => servicesMap[type].remove(data),
        {
            onSuccess: async () => {
                setQuery({ base_filter: undefined });
                successMsg({ message: `${type} has been successfully removed` });
                await queryClient.refetchQueries({ queryKey: ['infinity_first_page', 'tests'] });
            },
            onError: (e: any) => {
                errorMsg({ error: `Cannot remove the ${type}` });
                log.error(e);
            },
        },
    );
    const handleRemoveButtonClick = async () => {
        await removingMutation.mutateAsync({ id: item._id });
        infinityQuery.refetch();
        setOpened(false);
    };
    return (
        <Modal
            data-test="remove-item-modal"
            opened={opened}
            onClose={() => setOpened(false)}
            title={`Remove this ${type}?`}
        >
            <Text size="sm">
                Are you sure you want to permanently delete the {type}?
            </Text>
            <Group position="right">
                <Button
                    data-test="remove-item-modal-button"
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
