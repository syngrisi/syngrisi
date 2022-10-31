import ky from 'ky';
import * as devices from '../data/devices.json';

const baseUrl = import.meta.env.VITE_SYNGRISY_BASED_URL;
export default {
    baseUri: baseUrl || '',
    devices: devices.default,
    customDevicesProm: ky(`${baseUrl}/static/data/custom_devices.json`).json(),
};
