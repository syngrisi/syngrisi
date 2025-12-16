import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GenericService } from '@shared/services';
import { CheckDetails } from '@index/components/Tests/Table/Checks/CheckDetails/CheckDetails';
import { useParams } from '@hooks/useParams';
import { LoadingOverlay, Stack, Text, Group, useMantineTheme } from '@mantine/core';
import { errorMsg } from '@shared/utils';

export default function SharedCheckLayout() {
    const pollCountRef = useRef(0);
    const { query } = useParams();
    const checkId = query.checkId;
    const shareToken = query.share;
    const theme = useMantineTheme();

    const checkQuery = useQuery(
        {
            queryKey: [
                'check_for_modal',
                checkId,
            ],
            queryFn: () => GenericService.get(
                'checks',
                { _id: checkId },
                {
                    populate: 'baselineId,actualSnapshotId,diffId,test,suite,app',
                    limit: '1',
                    share: shareToken,
                },
                'initial_check_for_check_details_modal',
            ),
            enabled: !!checkId,
            refetchInterval: (data) => {
                const check = data?.results?.[0];
                if (check && !check.diffId) {
                    pollCountRef.current += 1;
                    const interval = Math.min(2000 * Math.pow(1.5, pollCountRef.current - 1), 10000);
                    return interval;
                }
                pollCountRef.current = 0;
                return false;
            },
            refetchOnWindowFocus: false,
            onError: (e) => {
                errorMsg({ error: e });
            },
        },
    );

    const checkData = checkQuery?.data?.results[0];

    if (checkQuery.isLoading && !checkData) {
        return (
            <Stack mt={60} align="center">
                <LoadingOverlay visible />
                <Text>Loading the data</Text>
            </Stack>
        );
    }

    if (checkQuery.isError) {
        return (
            <Stack mt={40} align="center">
                <Text color="red">Error load the check data</Text>
            </Stack>
        );
    }

    if (!checkData) {
        return (
            <Group mt={60} position="center">
                Empty check data
            </Group>
        );
    }

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            display: 'flex',
            paddingTop: '30px',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
             <CheckDetails
                initCheckData={checkData}
                checkQuery={checkQuery}
                closeHandler={() => {}}
                relatedRendered={false}
                testList={[]}
                apikey={shareToken}
            />
        </div>
    );
}
