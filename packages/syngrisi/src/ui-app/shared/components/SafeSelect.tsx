/* eslint-disable react/jsx-props-no-spreading */
import { Loader, Select } from '@mantine/core';

import React, { ReactElement } from 'react';

interface IOption {
    value: string,
    label: string
}

interface Props {
    optionsData: any;
    value: any;
    required?: boolean;
    loaded?: boolean;
    label: string;
    onChange: any;
    name: string;
    searchable: boolean;
    clearable: boolean;
    style?: React.CSSProperties;
    'data-test': string;
    placeholder: string;
    styles?: any;
    variant?: string;
    disabled: boolean;
    'aria-label'?: string;
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
        'aria-label': ariaLabel,
        style,
        styles,
        searchable,
        clearable,
        placeholder,
        variant,
        disabled,
        label
    }: Partial<Props>,
): ReactElement {
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };
    return (
        <>
            <Select
                label={label}
                data={optionsData}
                required={required}
                leftSection={loaded ? <Loader size={24} /> : undefined}
                value={value}
                onChange={onChange}
                style={style}
                searchable={searchable}
                clearable={clearable}
                placeholder={placeholder}
                variant={variant}
                styles={styles}
                data-test={dataTest}
                aria-label={ariaLabel}
                disabled={disabled}
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
