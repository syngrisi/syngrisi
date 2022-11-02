/* eslint-disable */
import { useMantineTheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import log from './Logger';

export function uuid() {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
    );
}

export function errorMsg(params: Required<{ error: any }>) {
    log.error(params.error);
    showNotification({
        ...params,
        message: String(params.error),
        autoClose: 7000,
        title: 'Error',
        color: 'red',
    });
}

export function successMsg(params: Required<{ message: string }>) {
    log.debug(params.message);
    showNotification({
        ...params,
        autoClose: 4000,
        title: 'Success',
        color: 'green',
    });
}

export function escapeRegExp(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const isJSON = (text: string) => !text ? '' : (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@')
    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
    .replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
