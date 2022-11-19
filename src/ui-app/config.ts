/* eslint-disable import/no-relative-packages */
import ky from 'ky';
import * as devices from '../data/devices.json';

// @ts-ignore
const baseUrl: any = import.meta.env.VITE_SYNGRISY_BASED_URL || '';

export default {
    baseUri: baseUrl,
    devices: devices.default,
    customDevicesProm: ky(`${baseUrl}/static/data/custom_devices.json`).json(),
};
