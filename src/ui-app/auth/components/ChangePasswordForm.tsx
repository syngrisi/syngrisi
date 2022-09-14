import * as React from 'react';
import {
    PasswordInput,
    Paper,
    Title,
    Container,
    Button,
    Text,
    LoadingOverlay,
} from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import ky from 'ky';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '@mantine/hooks';
import { log } from '../../shared/utils';
import config from '../../config';
import Bars from './change-password/Bars';
import PasswordRequirement from './change-password/PasswordRequirement';
import requirements from './change-password/requirements';

export default function ChangePasswordForm() {
    useDocumentTitle('Change Password Page');

    const [searchParams] = useSearchParams();
    const isFirstRun: boolean = !!searchParams.get('first_run');

    let validatedRequirements: { key: string, id: string, label: string, meets: boolean }[];

    interface Form {
        newPasswordConfirmation: string;
        newPassword: string;
        currentPassword: string
    }

    const form: UseFormReturnType<Form> = useForm({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            newPasswordConfirmation: '',
        },

        validate: {
            currentPassword: (val) => {
                if (isFirstRun) return null;
                // return 'Old password is Empty';
                return val !== '' ? null : 'Old password is Empty';
            },
            // eslint-disable-next-line no-unused-vars
            newPassword: (val) => {
                if (validatedRequirements.some((x) => !x.meets)) {
                    return 'The password doesn\'t meet the requirements';
                }
                return null;
            },
            newPasswordConfirmation: (val) => (val === form.values.newPassword
                ? null
                : 'New password and password confirmation must be match'),
        },
    });

    const [errorMessage, setErrorMessage] = useState('');

    const [loader, setLoader] = useState(false);

    validatedRequirements = requirements.map((requirement) => (
        {
            key: requirement.id,
            id: requirement.id,
            label: requirement.label,
            meets: requirement.re.test(form.values.newPassword),
        }
    ));

    const checks = validatedRequirements.map((requirement) => (
        <PasswordRequirement
            key={requirement.id}
            id={requirement.id}
            label={requirement.label}
            meets={requirement.meets}
        />
    ));

    function handleNewPasswordFields(event: React.ChangeEvent<HTMLInputElement>, path: string) {
        form.setFieldValue(path, event.currentTarget.value);
    }

    interface LoginFormData {
        currentPassword: string,
        newPassword: string,
        newPasswordConfirmation: string,
    }

    // eslint-disable-next-line consistent-return
    async function handleFormSubmissions(values: LoginFormData) {
        try {
            setErrorMessage('');
            setLoader(true);
            const url = isFirstRun ? `${config.baseUri}/v1/auth/change_first_run` : `${config.baseUri}/v1/auth/change`;
            const resp = await ky(
                url,
                {
                    throwHttpErrors: false,
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({
                        currentPassword: isFirstRun ? '' : values.currentPassword,
                        newPassword: values.newPassword,
                        isFirstRun,
                    }),
                    headers: {
                        'content-type': 'application/json',
                    },
                },
            );
            const result: { message: string } = await resp.json();
            setLoader(false);

            if (result.message === 'success') {
                return window.location.assign('/auth/changeSuccess');
            }
            if (result.message) {
                log.error(((typeof result) === 'object') ? JSON.stringify(result) : result.toString());
                return setErrorMessage(result.message);
            }
            log.error(((typeof result) === 'object') ? JSON.stringify(result) : result.toString());
            return setErrorMessage(result.message);
        } catch (e: any) {
            log.error(e.stack || e);
            setErrorMessage('Connection error');
        } finally {
            setLoader(false);
        }
    }

    interface FormValues {
        newPasswordConfirmation: string;
        newPassword: string;
        currentPassword: string
    }

    return (
        <Container size={420} my={40}>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form
                    onSubmit={form.onSubmit(
                        (values: FormValues) => handleFormSubmissions(values),
                    )}
                >
                    <Title order={isFirstRun ? 3 : 2} id="title">
                        {isFirstRun ? 'Change Password for default Administrator' : 'Change Password'}
                    </Title>
                    <PasswordInput
                        label="Current Password"
                        placeholder="Enter current password"
                        id="current-password"
                        value={isFirstRun ? '---------------' : form.values.currentPassword}
                        onChange={(event) => form.setFieldValue('currentPassword', event.currentTarget.value)}
                        error={form.errors.currentPassword && 'Invalid password'}
                        disabled={isFirstRun || false}
                        required
                    />

                    <PasswordInput
                        // value={newPassword}
                        // onChange={setNewPassword}
                        value={form.values.newPassword}
                        onChange={(event) => handleNewPasswordFields(event, 'newPassword')}
                        placeholder="New Password"
                        id="new-password"
                        label="New Password"
                        error={form.errors.newPassword}
                        required
                    />
                    <PasswordInput
                        value={form.values.newPasswordConfirmation}
                        onChange={(event) => handleNewPasswordFields(event, 'newPasswordConfirmation')}
                        placeholder="New Password"
                        id="new-password-confirmation"
                        label="New Password Confirmation"
                        error={form.errors.newPasswordConfirmation}
                        required
                    />

                    <Bars value={form.values.newPassword} />

                    <PasswordRequirement
                        label="Has at least 6 characters"
                        id="include-six-chars"
                        meets={form.values.newPassword.length > 5}
                    />
                    {checks}

                    {errorMessage
                    && <Text size="sm" color="red" mt="md" id="error-message" hidden={false}>{errorMessage}</Text>}

                    <Button
                        fullWidth
                        id="change-password"
                        mt="xl"
                        color="green"
                        type="submit"
                    >
                        Update password
                    </Button>
                    <LoadingOverlay
                        visible={loader}
                        transitionDuration={300}
                        overlayBlur={1}
                        loaderProps={{ color: 'green' }}
                    />
                </form>
            </Paper>
        </Container>
    );
}
