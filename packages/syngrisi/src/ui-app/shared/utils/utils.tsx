/* eslint-disable */
import { showNotification } from '@mantine/notifications';
import log from '@shared/utils/Logger';

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
        'aria-label': 'notification-error',
    });
}

export function successMsg(params: Required<{ message: string }>) {
    log.debug(params.message);
    showNotification({
        ...params,
        autoClose: 4000,
        title: 'Success',
        color: 'green',
        'aria-label': 'notification-success',
    });
}

export function escapeRegExp(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const isJSON = (text: string) => !text ? '' : (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@')
    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
    .replace(/(?:^|:|,)(?:\s*\[)+/g, '')));

export function getStatusMessage(check: any) {
    let statusMsg = '';
    if (check.status[0] === 'failed') {
        if (check.failReasons.includes('different_images')) {
            statusMsg = ' - images are different';
            const checkResult = check.result ? JSON.parse(check.result) : null;
            let diffPercent = checkResult.misMatchPercentage ? (checkResult.misMatchPercentage) : '';
            diffPercent = (
                (diffPercent === '0.00' || diffPercent === '')
                && (checkResult.rawMisMatchPercentage?.toString()?.length > 0)
            )
                ? checkResult.rawMisMatchPercentage
                : checkResult.misMatchPercentage;
            statusMsg += ` (${diffPercent}%)`;
        }
        if (check.failReasons.includes('wrong_dimensions')) {
            statusMsg = ' - images have the wrong dimensions';
        }
        if (check.failReasons.includes('not_accepted')) {
            statusMsg = ' - the previous check with the same parameter is not accepted';
        }
    }
    if (check.status[0] === 'new'){
        statusMsg = ' - first time check';
    }
    if (check.status[0] === 'passed'){
        statusMsg = ' - successful check';
    }
    return statusMsg;
}
