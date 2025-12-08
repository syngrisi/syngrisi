/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line */
import * as React from 'react';
import { Badge, Tooltip, useMantineTheme, Text, Stack } from '@mantine/core';
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/all';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import ActionPopoverIcon from '@shared/components/ActionPopoverIcon';
import { ChecksService } from '@shared/services';
import { errorMsg, successMsg } from '@shared/utils/utils';
import { log } from '@shared/utils/Logger';

interface Props {
    check: any
    initCheck?: any
    testUpdateQuery: any
    size?: number
    checksQuery: any
}

export function AcceptButton({ check, testUpdateQuery, checksQuery, initCheck, size = 19 }: Props) {
    const queryClient = useQueryClient();
    const theme = useMantineTheme();
    const [searchParams] = useSearchParams();
    const apikey = searchParams.get('apikey') || undefined;

    const isAccepted = (check.markedAs === 'accepted');
    const isCurrentlyAccepted = Boolean(check.isCurrentlyAccepted);
    const wasAcceptedEarlier = Boolean(check.wasAcceptedEarlier);

    // Determine icon type and color based on business rules
    // eslint-disable-next-line no-nested-ternary
    const iconType = isCurrentlyAccepted ? 'fill'
                   : wasAcceptedEarlier ? 'outline'
                   : 'outline';

    // eslint-disable-next-line no-nested-ternary
    const likeIconColor = (isCurrentlyAccepted || wasAcceptedEarlier)
        ? theme.colorScheme === 'dark'
            ? 'green.8'
            : 'green.6'
        : 'gray';

    const mutationAcceptCheck = useMutation(
        {
            mutationFn: (data: { check: any, newBaselineId: string }) => ChecksService.acceptCheck({ ...data, apikey }),
            onSuccess: async () => {
                successMsg({ message: 'Check has been successfully accepted' });
                await queryClient.invalidateQueries({ queryKey: ['preview_checks', check.test._id] });
                await queryClient.invalidateQueries({ queryKey: ['check_for_modal', check._id] });
                // Invalidate baseline queries so toolbar buttons become enabled after accept
                await queryClient.invalidateQueries({ queryKey: ['baseline_by_snapshot_id'] });
                await queryClient.refetchQueries(
                    { queryKey: ['related_checks_infinity_pages', initCheck?._id || check._id] },
                );
                checksQuery.refetch();
                if (testUpdateQuery) testUpdateQuery.refetch();
            },
            onError: (e: any) => {
                errorMsg({ error: 'Cannot accept the check' });
                log.error(e);
            },
        },
    );

    const notAcceptedIcon = check?.failReasons?.includes('not_accepted')
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
                data-test="not-accepted-error-icon"
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
        const actualSnapshotId = check.actualSnapshotId?._id || check.actualSnapshotId;
        if (!actualSnapshotId) {
            log.error(`Cannot accept the check '${check._id}' - missing actual snapshot id`);
            return;
        }
        mutationAcceptCheck.mutate(
            {
                check,
                newBaselineId: actualSnapshotId,
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
                            <Text data-test="accept-button-tooltip-username">
                                Accepted by: {check.markedByUsername}
                            </Text>
                            <Text data-test="accept-button-tooltip-date">
                                Accepted Date: {check.markedDate}
                            </Text>
                        </Stack>
                    )
                    : (
                        <Text>The check is not accepted</Text>
                    )
            }
        >
            <div style={{ pointerEvents: 'none' }}>
                <ActionPopoverIcon
                    iconColor={likeIconColor}
                    buttonColor="green"
                    sx={{
                        cursor: isCurrentlyAccepted ? 'default' : 'pointer',
                        '&:hover': { backgroundColor: isCurrentlyAccepted ? 'rgba(255, 255, 255, 0);' : '' },
                        pointerEvents: 'auto',
                    }}
                    testAttr="check-accept-icon"
                    testAttrName={check.name}
                    variant="subtle"
                    paused={isCurrentlyAccepted}
                    icon={
                        iconType === 'fill'
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
