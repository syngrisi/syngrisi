/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useMantineTheme } from '@mantine/core';
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/all';
import { useMutation } from '@tanstack/react-query';
import ActionPopoverIcon from '../../../../../shared/components/ActionPopoverIcon';
import { ChecksService } from '../../../../../shared/services/checks.service';
import { errorMsg, successMsg } from '../../../../../shared/utils/utils';
import { log } from '../../../../../shared/utils/Logger';

interface Props {
    check: any
    testUpdateQuery: any
    checksQuery: any
}

export function AcceptButton({ check, testUpdateQuery, checksQuery }: Props) {
    const theme = useMantineTheme();

    const isAccepted = (check.markedAs === 'accepted');// || mutationAcceptCheck.isSuccess;
    const isCurrentlyAccepted = ((check.baselineId._id === check.actualSnapshotId._id) && isAccepted);
    // eslint-disable-next-line no-nested-ternary
    const likeIconColor = isAccepted
        ? theme.colorScheme === 'dark'
            ? 'green.8'
            : 'green.6'
        : 'gray';

    const mutationAcceptCheck = useMutation(
        (data: { check: any, newBaselineId: string }) => ChecksService.acceptCheck(data),
        {
            onSuccess: async (result: any) => {
                successMsg({ message: 'Check has been successfully accepted' });
                log.debug({ result });
                testUpdateQuery.refetch();
                checksQuery.refetch();
            },
            onError: (e: any) => {
                errorMsg({ error: 'Cannot accept the check' });
                log.error(e);
            },
        },
    );

    const handleAcceptCheckClick = () => {
        if (isCurrentlyAccepted) return;
        mutationAcceptCheck.mutate(
            {
                check,
                newBaselineId: check.actualSnapshotId._id,
            } as any,
        );
    };

    return (
        <ActionPopoverIcon
            color={likeIconColor}
            buttonColor="green"
            sx={{
                cursor: isCurrentlyAccepted ? 'default' : 'pointer',
                '&:hover': { backgroundColor: isCurrentlyAccepted ? 'rgba(255, 255, 255, 0);' : '' },
            }}
            testAttr="check-accept-icon"
            variant="subtle"
            paused={isCurrentlyAccepted}
            icon={
                (isCurrentlyAccepted && isAccepted)
                    ? <BsHandThumbsUpFill size={19} />
                    : <BsHandThumbsUp size={19} />
            }
            action={handleAcceptCheckClick}
            title="Accept the check actual screenshot"
            loading={mutationAcceptCheck.isLoading}
            confirmLabel="Accept"
        />
    );
}
