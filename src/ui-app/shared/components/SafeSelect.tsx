/* eslint-disable react/jsx-props-no-spreading */
import { Loader, Select, Sx } from '@mantine/core';

import React, { ReactElement } from 'react';

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
    sx: Sx
    'data-test': string
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
