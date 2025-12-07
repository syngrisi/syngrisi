/* eslint-disable import/no-relative-packages */
import * as devices from '../server/data/devices.json';

// @ts-ignore
const baseUrl: any = import.meta.env.VITE_SYNGRISI_BASED_URL || '';
// @ts-ignore
const indexRoute: any = import.meta.env.VITE_INDEX_ROUTE || '/';

export default {
    baseUri: baseUrl,
    devices: devices.default,
    customDevicesProm: fetch(`${baseUrl}/static/data/custom_devices.json`).then(r => r.json()),
    indexRoute,
};
