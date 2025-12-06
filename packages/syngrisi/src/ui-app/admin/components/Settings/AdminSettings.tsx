/* eslint-disable react/jsx-one-expression-per-line,no-nested-ternary,indent,react/jsx-indent */
import * as React from 'react';
import { Title, LoadingOverlay, Text, Box, ScrollArea } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useSubpageEffect, useNavProgressFetchEffect } from '@shared/hooks';
import { ISettingForm } from '@admin/components/Settings/Forms/interfaces';
import { errorMsg, log } from '@shared/utils';
import { FormWrapper } from '@admin/components/Settings/Forms/FormWrapper';
import { GenericService } from '@shared/services';

import { SsoSettingsForm } from './SsoSettingsForm';

export default function AdminSettings() {
    useSubpageEffect('Settings');
    const settingsQuery: any = useQuery(
        ['settings'],
        () => GenericService.get('settings'),
        {
            enabled: true,
            onError: (err: any) => {
                errorMsg({ error: err });
                log.error(err);
            },
        },
    );
    useNavProgressFetchEffect(settingsQuery.isFetching);

    return (
        <ScrollArea type="auto" h="calc(100vh - 120px)">
            <Box p={10} sx={{ minHeight: '100%' }}>
                <Title>Admin Settings</Title>
                {
                    settingsQuery.isLoading
                        ? <LoadingOverlay visible={settingsQuery.isLoading} />
                        : settingsQuery.isSuccess
                            ? (
                                <>
                                    <SsoSettingsForm settings={settingsQuery.data} refetch={settingsQuery.refetch} />
                                    {settingsQuery.data
                                        .filter((item: ISettingForm) => !item.name.startsWith('sso_'))
                                        .map(
                                            (item: ISettingForm) => (
                                                <FormWrapper
                                                    key={item.name}
                                                    name={item.name}
                                                    description={item.description}
                                                    label={item.label}
                                                    value={item.value}
                                                    enabled={item.enabled}
                                                    type={item.type}
                                                    settingsQuery={settingsQuery}
                                                />
                                            ),
                                        )}
                                </>
                            )
                            : <Text color="red"> Cannot load data: {settingsQuery.error.toString()}</Text>
                }
            </Box>
        </ScrollArea>
    );
}
