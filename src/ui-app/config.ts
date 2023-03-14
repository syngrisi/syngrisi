/* eslint-disable import/no-relative-packages */
import ky from 'ky';
import * as devices from '../data/devices.json';

// @ts-ignore
const baseUrl: any = import.meta.env.VITE_SYNGRISI_BASED_URL || '';
// @ts-ignore
const indexRoute: any = import.meta.env.VITE_INDEX_ROUTE || '/';

export default {
    baseUri: baseUrl,
    devices: devices.default,
    customDevicesProm: ky(`${baseUrl}/static/data/custom_devices.json`).json(),
    indexRoute,
};
