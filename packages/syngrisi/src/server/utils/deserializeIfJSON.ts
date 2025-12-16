import { EJSON } from 'bson';
import { isJSON } from '.';

const deserializeIfJSON = (text: string) => {
    if (isJSON(text)) return EJSON.parse(text) || undefined;
    return text;
};

export default deserializeIfJSON;
