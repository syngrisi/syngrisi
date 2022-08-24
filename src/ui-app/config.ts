// this config is only used for local development
// @ts-ignore
const baseUrl = import.meta.env.VITE_SYNGRISY_BASED_URL;
export default {
    baseUri: baseUrl || '',
};
