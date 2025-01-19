/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line */
import * as React from 'react';
import { Badge, Tooltip, useMantineTheme, Text, Stack } from '@mantine/core';
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/all';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import ActionPopoverIcon from '../../../../../shared/components/ActionPopoverIcon';
import { ChecksService } from '../../../../../shared/services';
import { errorMsg, successMsg } from '../../../../../shared/utils/utils';
import { log } from '../../../../../shared/utils/Logger';
import { ident } from '../../../../../shared/utils/ident';

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

    // Fetch the current baseline using the check's ident fields
    const { data: currentBaseline } = useQuery({
        queryKey: ['baseline', ...ident.map((field) => check[field])],
        queryFn: async () => {
            const params = new URLSearchParams(
                Object.fromEntries([
                    ...ident.map((field) => [field, check[field]]),
                    ['markedAs', 'accepted'],
                    ...(apikey ? [['apikey', apikey]] : []),
                ]),
            );
            const response = await fetch(
                `/v1/baselines?${params.toString()}`,
            );
            const data = await response.json();
            return data.results[0]; // Get the first baseline that matches the ident
        },
    });

    const isAccepted = (check.markedAs === 'accepted');
    const isCurrentlyAccepted = isAccepted
        && currentBaseline?.snapshootId
        && check.actualSnapshotId?._id === currentBaseline.snapshootId;
    // eslint-disable-next-line no-nested-ternary
    const likeIconColor = isAccepted
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
                await queryClient.refetchQueries(
                    { queryKey: ['related_checks_infinity_pages', initCheck?._id || check._id] },
                );
                await queryClient.invalidateQueries({
                    queryKey: ['baseline', ...ident.map((field) => check[field])],
                });
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
