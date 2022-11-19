/* eslint-disable react/jsx-props-no-spreading */
import { Loader, Select } from '@mantine/core';

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
    sx: any
}

// select component for selenium
function SafeSelect(
    {
        optionsData,
        required = false,
        loaded = false,
        value,
        name,
        ...rest
    }: Partial<Props>,
): ReactElement {
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        rest.onChange(event.target.value);
    };
    return (
        <>
            <Select
                data={optionsData}
                required={required}
                dropdownPosition="bottom"
                icon={loaded && <Loader size={24} />}
                value={value}
                {...rest}
            />
            <select
                name={name}
                style={{ width: 0, opacity: 0, position: 'fixed' }}
                value={value}
                onChange={changeHandler}
                {...rest}
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
