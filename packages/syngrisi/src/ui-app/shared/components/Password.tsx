/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Box, PasswordInput, Popover, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

export const Password = {
    Requirement({ meets, label }: { meets: boolean, label: string }) {
        return (
            <Text
                color={meets ? 'teal' : 'red'}
                sx={{ display: 'flex', alignItems: 'center' }}
                mt={7}
                size="sm"
            >
                {meets
                    ? <IconCheck size={14} />
                    : <IconX size={14} />}
                <Box ml={10}>{label}</Box>
            </Text>
        );
    },

    Popover(
        {
            disabled,
            form,
            label = '',
            ...rest
        }: { disabled: boolean, form: any, label?: string, [key: string]: any },
    ) {
        const [popoverOpened, setPopoverOpened] = useState(false);

        const [checks, setChecks] = useState([]);

        useEffect(() => {
            if (checks.length) {
                setPopoverOpened(true);
            }
        }, [form.errors.password]);

        return (
            <Popover opened={popoverOpened} position="bottom" width={200} transition="pop">
                <Popover.Target>
                    <PasswordInput
                        onFocusCapture={(e) => {
                            if (e.target.value !== '') setPopoverOpened(true);
                        }}
                        onBlurCapture={() => setPopoverOpened(false)}
                        onChange={(event) => {
                            setPopoverOpened(true);
                            form.getInputProps('password').onChange(event);
                            setChecks(() => Password.passwordsRequirementsForPopOver(event.target.value).result);
                        }}
                        error={form.getInputProps('password').error}
                        value={form.getInputProps('password').value}
                        sx={{ width: '16%' }}
                        placeholder="Your password"
                        disabled={disabled}
                        autoComplete="off"
                        required
                        aria-label={label}
                        {...rest}
                        label={label}
                    />
                </Popover.Target>
                <Popover.Dropdown>
                    {checks}
                </Popover.Dropdown>
            </Popover>
        );
    },

    passwordsRequirementsForPopOver(password: string) {
        const passwordRequirements = [
            { index: 0, re: /.{6}/, label: 'Includes at least 6 characters' },
            { index: 1, re: /[0-9]/, label: 'Includes number' },
            { index: 2, re: /[a-z]/, label: 'Includes lowercase letter' },
            { index: 3, re: /[A-Z]/, label: 'Includes uppercase letter' },
            { index: 4, re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
        ];

        const result: any = [];
        passwordRequirements.forEach((requirement) => {
            result.push(
                <Password.Requirement
                    key={requirement.index}
                    meets={requirement.re.test(password)}
                    label={requirement.label}
                />,
            );
        });
        const isFail = result.filter((x: any) => !x.props.meets).length > 0 ? true : null;
        return { result, isFail };
    },
};
