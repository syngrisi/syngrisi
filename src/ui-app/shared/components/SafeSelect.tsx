/* eslint-disable */
import { Select } from '@mantine/core';

import React, { ReactElement } from 'react';

interface IOption {
    value: string,
    label: string
}

// select component for selenium
function SafeSelect({ optionsData, ...rest }: any): ReactElement {
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        rest.onChange(event.target.value);
    }
    return (
        <>
            <Select
                data={optionsData}
                required
                {...rest}

            />
            <select name={rest.name}
                    style={{ width: 0, opacity: 0, position: 'fixed' }}
                    {...{ ...rest, onChange: changeHandler }}
            >
                {optionsData.map((option: IOption) => {
                    return <option key={option.value} value={option.value}>{option.label}</option>
                })}
            </select>
        </>
    );
}

export default SafeSelect;
