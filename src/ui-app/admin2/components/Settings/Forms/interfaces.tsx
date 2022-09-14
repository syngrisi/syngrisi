export interface ISettingForm {
    name: string
    value: string
    label: string
    description: string
    enabled: boolean
    // setFormData?: any
    updateSetting?: any
    type?: string
}

export interface ISettingFormUpdateData {
    name: string
    enabled: boolean
    value: string
}
