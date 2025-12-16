export interface ISettingForm {
    name: string;
    value: any;
    label: string;
    description: string;
    enabled: boolean;
    updateSetting?: any;
    type?: string;
    settingsQuery?: any;
}

export interface ISettingFormUpdateData {
    name: string;
    enabled: boolean;
    value: any;
}
