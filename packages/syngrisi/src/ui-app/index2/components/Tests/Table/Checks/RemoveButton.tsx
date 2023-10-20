/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { IconTrash } from '@tabler/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ActionPopoverIcon from '../../../../../shared/components/ActionPopoverIcon';
import { ChecksService } from '../../../../../shared/services';
import { errorMsg, successMsg } from '../../../../../shared/utils/utils';
import { log } from '../../../../../shared/utils/Logger';

interface Props {
    testUpdateQuery: any,
    closeHandler?: any,
    size?: number,
    check: any
    initCheck?: any
}

export function RemoveButton({ testUpdateQuery, check, closeHandler, initCheck, size = 24 }: Props) {
    const queryClient = useQueryClient();
    const mutationRemoveCheck = useMutation(
        (data: { id: string }) => ChecksService.removeCheck(data),
        {
            onSuccess: async () => {
                successMsg({ message: 'Check has been successfully removed' });

                await queryClient.invalidateQueries({ queryKey: ['preview_checks', check.test._id || check.test] });
                await queryClient.invalidateQueries({ queryKey: ['check_for_modal', check._id] });
                await queryClient.refetchQueries(
                    { queryKey: ['related_checks_infinity_pages', initCheck?._id || check._id] },
                );

                if (testUpdateQuery) testUpdateQuery.refetch();
                if (closeHandler) closeHandler();
            },
            onError: (e: any) => {
                errorMsg({ error: 'Cannot remove the check' });
                log.error(e);
            },
        },
    );

    const handleRemoveCheckClick = () => {
        mutationRemoveCheck.mutate(
            {
                id: check._id,
            } as any,
        );
    };
    return (
        <ActionPopoverIcon
            testAttr="check-remove-icon"
            variant="subtle"
            icon={<IconTrash stroke={1} size={size} />}
            action={handleRemoveCheckClick}
            title="Delete check"
            testAttrName={check?.name}
            loading={mutationRemoveCheck.isLoading}
            confirmLabel="Delete"
            size={size}
            color="red"
        />
    );
}
