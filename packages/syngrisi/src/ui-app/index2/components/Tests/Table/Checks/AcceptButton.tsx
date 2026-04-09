/* eslint-disable no-underscore-dangle,react/jsx-one-expression-per-line */
import * as React from 'react';
import { Box, useMantineTheme, useComputedColorScheme, Text, Stack } from '@mantine/core';
import { IconThumbUp } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import ActionPopoverIcon from '@shared/components/ActionPopoverIcon';
import { ChecksService } from '@shared/services';
import { errorMsg, successMsg } from '@shared/utils/utils';
import { log } from '@shared/utils/Logger';
import { replaceItemInInfinitePages, replaceItemInPaginatedResult } from '@shared/utils/queryCache';

interface Props {
    check: any
    initCheck?: any
    testUpdateQuery: any
    size?: number
    buttonSize?: number
    checksQuery: any
}

const getEntityId = (value: any) => value?._id || value?.id || value;
const hasSnapshotFilename = (value: any) => Boolean(value && typeof value === 'object' && value.filename);

const mergeSnapshotRef = (currentValue: any, nextValue: any, fallbackValue?: any) => {
    if (hasSnapshotFilename(nextValue)) return nextValue;

    const nextId = getEntityId(nextValue);
    if (!nextId) return fallbackValue || currentValue || nextValue;

    const currentId = getEntityId(currentValue);
    if (currentId && String(currentId) === String(nextId)) return currentValue;

    const fallbackId = getEntityId(fallbackValue);
    if (fallbackId && String(fallbackId) === String(nextId)) return fallbackValue;

    return nextValue;
};

export function AcceptButton({ check, testUpdateQuery, checksQuery, initCheck, size = 19, buttonSize }: Props) {
    const queryClient = useQueryClient();
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme();
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

    const activeLikeFillColor = colorScheme === 'dark'
        ? theme.colors.green[4]
        : theme.colors.green[3];
    const activeLikeStrokeColor = colorScheme === 'dark'
        ? theme.colors.green[8]
        : theme.colors.green[8];

    // eslint-disable-next-line no-nested-ternary
    const likeIconColor = (isCurrentlyAccepted || wasAcceptedEarlier)
        ? colorScheme === 'dark'
            ? 'green.8'
            : 'green.6'
        : 'gray';

    const mutationAcceptCheck = useMutation(
        {
            mutationFn: (data: { check: any, newBaselineId: string }) => ChecksService.acceptCheck({ ...data, apikey }),
            onSuccess: async (updatedCheck: any) => {
                successMsg({ message: 'Check has been successfully accepted' });

                const testId = check.test?._id || check.test;
                const nextCheck = {
                    ...check,
                    ...updatedCheck,
                    baselineId: mergeSnapshotRef(check.baselineId, updatedCheck?.baselineId, check.actualSnapshotId),
                    actualSnapshotId: mergeSnapshotRef(check.actualSnapshotId, updatedCheck?.actualSnapshotId),
                    diffId: mergeSnapshotRef(check.diffId, updatedCheck?.diffId),
                    markedAs: 'accepted',
                    isCurrentlyAccepted: true,
                    wasAcceptedEarlier: false,
                };

                if (testId) {
                    queryClient.setQueryData(
                        ['preview_checks', testId],
                        (current: any) => replaceItemInPaginatedResult(current, nextCheck),
                    );
                }
                queryClient.setQueryData(
                    ['check_for_modal', check._id],
                    (current: any) => replaceItemInPaginatedResult(current, nextCheck),
                );
                if (testId) {
                    queryClient.setQueryData(
                        ['sibling_checks', testId],
                        (current: any) => replaceItemInPaginatedResult(current, nextCheck),
                    );
                }
                queryClient.setQueriesData(
                    { queryKey: ['related_checks_infinity_pages'] },
                    (current: any) => replaceItemInInfinitePages(current, nextCheck),
                );

                await queryClient.refetchQueries(
                    { queryKey: ['related_checks_infinity_pages', initCheck?._id || check._id] },
                );

                await testUpdateQuery.refetch();
            },
            onError: (e: any) => {
                errorMsg({ error: 'Cannot accept the check' });
                log.error(e);
            },
        },
    );

    const notAcceptedIcon = check?.failReasons?.includes('not_accepted')
        ? (
            <Box
                title="The check is not accepted"
                data-test="not-accepted-error-icon"
                style={{
                    position: 'absolute',
                    bottom: 11,
                    left: 12,
                    minWidth: 18,
                    height: 22,
                    padding: '0 6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.yellow[6],
                    color: theme.white,
                    borderRadius: 999,
                    lineHeight: 1,
                    fontWeight: 600,
                    fontSize: '12px',
                    fontFamily: '"Roboto","Arial",sans-serif',
                    zIndex: 2,
                    boxSizing: 'border-box',
                    overflow: 'visible',
                    userSelect: 'none',
                    border: '2px solid',
                    borderColor: colorScheme === 'dark' ? theme.colors.dark[6] : 'white',
                }}
            >
                !
            </Box>
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

    const tooltipLabel = check.markedByUsername
        ? (
            <Stack gap="xs" p={5}>
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
        );

    return (
        <ActionPopoverIcon
            iconColor={likeIconColor}
            buttonColor="green"
            size={buttonSize}
            style={{
                cursor: isCurrentlyAccepted ? 'default' : 'pointer',
                '&:hover': { backgroundColor: isCurrentlyAccepted ? 'rgba(255, 255, 255, 0);' : '' },
            }}
            testAttr="check-accept-icon"
            testAttrName={check.name}
            variant="subtle"
            paused={isCurrentlyAccepted}
            icon={
                iconType === 'fill'
                    ? (
                        <IconThumbUp
                            size={Math.max(size + 1, 17)}
                            stroke={1.3}
                            color={activeLikeStrokeColor}
                            fill={activeLikeFillColor}
                            data-test-icon-type="fill"
                            style={{ display: 'block', transform: 'translateY(-0.5px)', opacity: 0.96 }}
                        />
                    )
                    : (
                        <>
                            <IconThumbUp
                                size={size}
                                stroke={1.35}
                                data-test-icon-type="outline"
                                style={{ display: 'block', transform: 'translateY(0.5px)' }}
                            />
                            {notAcceptedIcon}
                        </>
                    )
            }
            action={handleAcceptCheckClick}
            title={tooltipLabel}
            loading={mutationAcceptCheck.isPending}
            confirmLabel="Accept"
        />
    );
}
