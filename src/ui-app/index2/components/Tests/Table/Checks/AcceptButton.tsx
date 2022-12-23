/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line */
import * as React from 'react';
import { Badge, Tooltip, useMantineTheme, Text, Stack } from '@mantine/core';
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/all';
import { useMutation } from '@tanstack/react-query';
import ActionPopoverIcon from '../../../../../shared/components/ActionPopoverIcon';
import { ChecksService } from '../../../../../shared/services';
import { errorMsg, successMsg } from '../../../../../shared/utils/utils';
import { log } from '../../../../../shared/utils/Logger';

interface Props {
    check: any
    testUpdateQuery: any
    size?: number
    checksQuery: any
}

export function AcceptButton({ check, testUpdateQuery, checksQuery, size = 19 }: Props) {
    const theme = useMantineTheme();

    const isAccepted = (check.markedAs === 'accepted');// || mutationAcceptCheck.isSuccess;
    const isCurrentlyAccepted = ((check.baselineId?._id === check.actualSnapshotId?._id) && isAccepted);
    // eslint-disable-next-line no-nested-ternary
    const likeIconColor = isAccepted
        ? theme.colorScheme === 'dark'
            ? 'green.8'
            : 'green.6'
        : 'gray';

    const mutationAcceptCheck = useMutation(
        (data: { check: any, newBaselineId: string }) => ChecksService.acceptCheck(data),
        {
            // eslint-disable-next-line no-unused-vars
            onSuccess: async (result: any) => {
                successMsg({ message: 'Check has been successfully accepted' });
                checksQuery.refetch();
                if (testUpdateQuery) testUpdateQuery.refetch();
            },
            onError: (e: any) => {
                errorMsg({ error: 'Cannot accept the check' });
                log.error(e);
            },
        },
    );

    const notAcceptedIcon = check.failReasons.includes('not_accepted')
        ? (
            <Badge
                component="div"
                title="The check is not accepted"
                pl={4}
                pr={4}
                pt={6}
                pb={6}
                // weight={900}
                color="yellow"
                variant="filled"
                radius="xl"
                data-test="check-wrong-images-size-error-icon"
                sx={{
                    fontSize: '12px',
                    position: 'absolute',
                    bottom: 11,
                    left: 12,
                    lineHeight: '16px',
                    fontWeight: 600,
                    fontFamily: '"Roboto","Arial",sans-serif',
                    border: '2px',
                    borderStyle: 'solid',
                    borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : 'white',
                }}
            >
                !
            </Badge>
        )
        : '';
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
        <Tooltip
            withinPortal
            label={
                check.markedByUsername
                    ? (
                        <Stack spacing="xs" p={5}>
                            <Text>
                                Accepted by: {check.markedByUsername}
                            </Text>
                            <Text>
                                Accepted Date: {check.markedDate}
                            </Text>
                        </Stack>
                    )
                    : (
                        <Text>The check is not accepted</Text>
                    )
            }
        >
            <div>
                <ActionPopoverIcon
                    iconColor={likeIconColor}
                    buttonColor="green"
                    sx={{
                        cursor: isCurrentlyAccepted ? 'default' : 'pointer',
                        '&:hover': { backgroundColor: isCurrentlyAccepted ? 'rgba(255, 255, 255, 0);' : '' },
                    }}
                    testAttr="check-accept-icon"
                    testAttrName={check.name}
                    variant="subtle"
                    paused={isCurrentlyAccepted}
                    icon={
                        (isCurrentlyAccepted && isAccepted)
                            ? (

                                <BsHandThumbsUpFill size={size} data-test-icon-type="fill" />
                            )
                            : (<><BsHandThumbsUp size={size} data-test-icon-type="outline" />{notAcceptedIcon}</>)
                    }
                    action={handleAcceptCheckClick}
                    // title="Accept the check actual screenshot"
                    loading={mutationAcceptCheck.isLoading}
                    confirmLabel="Accept"
                    size={size}
                />
            </div>
        </Tooltip>
    );
}
