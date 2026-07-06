export interface ISettingForm {
    name: string;
    value: any;
    label: string;
    description: string;
    enabled: boolean;
    updateSetting?: any;
    type?: string;
    settingsQuery?: any;
    // Set by the server when a controlling env var is explicitly provided: the
    // toggle is then locked and shows the value from the environment.
    envControlled?: boolean;
    // Raw controlling env var name from the setting seed (server field).
    env_variable?: string;
    // Same, threaded to the form as a prop (camelCase).
    envVariable?: string;
}

export interface ISettingFormUpdateData {
    name: string;
    enabled: boolean;
    value: any;
}
