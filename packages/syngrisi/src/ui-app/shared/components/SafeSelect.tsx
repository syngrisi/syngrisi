/* eslint-disable react/jsx-props-no-spreading */
import { Loader, Select } from '@mantine/core';

import React, { ReactElement, useCallback, useEffect, useRef } from 'react';

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
    // Native <select> change handler — supports both React synthetic events
    // and native DOM events (from Playwright selectOption)
    const selectRef = useRef<HTMLSelectElement>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        const el = selectRef.current;
        if (!el) return;
        const handler = () => onChangeRef.current(el.value);
        el.addEventListener('change', handler);
        return () => el.removeEventListener('change', handler);
    }, []);

    // Sync native select value when React value changes
    useEffect(() => {
        if (selectRef.current && value !== undefined) {
            selectRef.current.value = value;
        }
    }, [value]);

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
                ref={selectRef}
                name={name}
                style={{ width: 0, opacity: 0, position: 'fixed' }}
                defaultValue={value || ''}
                data-test={dataTest}
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
