/* eslint-disable react/jsx-one-expression-per-line,no-nested-ternary,indent,react/jsx-indent */
import * as React from 'react';
import { LoadingOverlay, Text, Box, ScrollArea, Tabs } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useSubpageEffect, useNavProgressFetchEffect } from '@shared/hooks';
import { ISettingForm } from '@admin/components/Settings/Forms/interfaces';

import { FormWrapper } from '@admin/components/Settings/Forms/FormWrapper';
import { GenericService } from '@shared/services';
import { AdminPageHeader } from '@admin/components/common/AdminPageHeader';

import { SsoSettingsForm } from './SsoSettingsForm';
import { PerProjectSettings } from './PerProjectSettings';

export default function AdminSettings() {
    useSubpageEffect('Settings');
    const settingsQuery: any = useQuery({
        queryKey: ['settings'],
        queryFn: () => GenericService.get('settings'),
        enabled: true,
    });
    useNavProgressFetchEffect(settingsQuery.isFetching);

    return (
        <ScrollArea type="auto" h="calc(100vh - 120px)">
            <Box p={10} style={{ minHeight: '100%' }}>
                <AdminPageHeader
                    icon={<IconSettings size={24} />}
                    title="Admin Settings"
                    description="Instance configuration and per-project settings."
                />
                <Tabs defaultValue="settings" mt="sm" keepMounted={false}>
                    <Tabs.List>
                        <Tabs.Tab value="settings" data-test="settings-tab-general">Settings</Tabs.Tab>
                        <Tabs.Tab value="projects" data-test="settings-tab-projects">Project settings</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="settings">
                        {
                            settingsQuery.isLoading
                                ? <LoadingOverlay visible={settingsQuery.isLoading} />
                                : settingsQuery.isSuccess
                                    ? (
                                        <>
                                            <SsoSettingsForm settings={settingsQuery.data} refetch={settingsQuery.refetch} />
                                            {settingsQuery.data
                                                .filter((item: ISettingForm) => !item.name.startsWith('sso_'))
                                                // ai_triage_* get a dedicated AI Providers section (TODO); skip generic form
                                                .filter((item: ISettingForm) => !item.name.startsWith('ai_triage_'))
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
                                                            envControlled={item.envControlled}
                                                            envVariable={item.env_variable}
                                                            settingsQuery={settingsQuery}
                                                        />
                                                    ),
                                                )}
                                        </>
                                    )
                                    : <Text c="red"> Cannot load data: {settingsQuery.error.toString()}</Text>
                        }
                    </Tabs.Panel>
                    <Tabs.Panel value="projects">
                        <PerProjectSettings />
                    </Tabs.Panel>
                </Tabs>
            </Box>
        </ScrollArea>
    );
}
