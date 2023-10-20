/* eslint-disable react/jsx-one-expression-per-line,no-nested-ternary,indent,react/jsx-indent */
import * as React from 'react';
import { Title, LoadingOverlay, Text, Box } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useSubpageEffect, useNavProgressFetchEffect } from '../../../shared/hooks';
import { ISettingForm } from './Forms/interfaces';
import { errorMsg, log } from '../../../shared/utils';
import { FormWrapper } from './Forms/FormWrapper';
import { GenericService } from '../../../shared/services';

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
        <Box p={10}>
            <Title>Admin Settings</Title>
            {
                settingsQuery.isLoading
                    ? <LoadingOverlay visible={settingsQuery.isLoading} />
                    : settingsQuery.isSuccess
                        ? settingsQuery.data.map(
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
                        )
                        : <Text color="red"> Cannot load data: {settingsQuery.error.toString()}</Text>
            }
        </Box>
    );
}
