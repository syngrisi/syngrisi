/* eslint-disable */
import { useMantineTheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import log from './Logger';

export const isDark = () => useMantineTheme().colorScheme === 'dark';

export function uuid() {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
    );
}

export function errorMsg(params: Required<{ message: string }>) {
    showNotification({
        ...params,
        onOpen: () => log.error(params.message),
        autoClose: 7000,
        title: 'Error',
        color: 'red',
    });
}

export function successMsg(params: Required<{ message: string }>) {
    showNotification({
        ...params,
        onOpen: () => log.debug(params.message),
        autoClose: 4000,
        title: 'Success',
        color: 'green',
    });
}
