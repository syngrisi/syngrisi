import { EJSON } from 'bson';
import { isJSON } from '.';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deserializeIfJSON = (text: string): any => {
    if (isJSON(text)) return EJSON.parse(text) || undefined;
    return text;
};

export default deserializeIfJSON;
