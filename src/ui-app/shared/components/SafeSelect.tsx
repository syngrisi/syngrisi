/* eslint-disable react/jsx-props-no-spreading */
import { InputVariant, Loader, Select, Styles, Sx } from '@mantine/core';

import React, { ReactElement } from 'react';
// eslint-disable-next-line import/no-unresolved
import { BaseSelectStylesNames } from '@mantine/core/lib/Select/types';

interface IOption {
    value: string,
    label: string
}

interface Props {
    optionsData: any
    value: any
    required?: boolean
    loaded?: boolean
    label: string
    onChange: any
    name: string
    searchable: boolean
    clearable: boolean
    sx: Sx
    'data-test': string
    placeholder: string
    styles: Styles<BaseSelectStylesNames, Record<string, any>> | undefined
    variant: InputVariant
}

// select component for selenium
function SafeSelect(
    {
        optionsData,
        required = false,
        loaded = false,
        value,
        name,
        onChange,
        'data-test': dataTest,
        sx,
        styles,
        searchable,
        clearable,
        placeholder,
        variant,
    }: Partial<Props>,
): ReactElement {
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };
    return (
        <>
            <Select
                data={optionsData}
                required={required}
                dropdownPosition="bottom"
                icon={loaded && <Loader size={24} />}
                value={value}
                onChange={onChange}
                sx={sx}
                searchable={searchable}
                clearable={clearable}
                placeholder={placeholder}
                variant={variant}
                styles={styles}
            />
            <select
                name={name}
                style={{ width: 0, opacity: 0, position: 'fixed' }}
                value={value}
                data-test={dataTest}
                onChange={changeHandler}
            >
                {
                    optionsData.map((option: IOption) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))
                }
            </select>
        </>
    );
}

export default SafeSelect;
