import { Paper } from '@mantine/core';
import React, { FC } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ISettingForm, ISettingFormUpdateData } from './interfaces';
import SettingsForms from './index';
import { SettingsService } from '../../../../shared/services/settings.service';
import { errorMsg } from '../../../../shared/utils';
import { successMsg } from '../../../../shared/utils/utils';

function FormWrapper({ name, value, label, description, enabled, type, settingsQuery }: ISettingForm) {
    const Form: FC<ISettingForm> = SettingsForms[type as keyof typeof SettingsForms];

    const updateSetting = useMutation(
        (data: ISettingFormUpdateData) => SettingsService.update(data),
        {
            onSuccess: async () => {
                successMsg({ message: `Parameter '${name}' saved` });
            },
            onError: (e: any) => {
                errorMsg({ message: e.toString() });
            },
            onSettled: () => settingsQuery.refetch(),
        },
    );

    return (
        <Paper
            withBorder
            p={20}
            m={15}
            sx={{ width: '90%' }}
        >
            <Form
                name={name}
                description={description}
                label={label}
                value={value}
                enabled={enabled}
                updateSetting={updateSetting}
            />
        </Paper>
    );
}

export { FormWrapper };
