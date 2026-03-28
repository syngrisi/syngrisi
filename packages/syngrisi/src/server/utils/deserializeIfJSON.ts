import { EJSON } from 'bson';
import { isJSON } from '.';

const EXTENDED_JSON_KEYS = [
    '$oid',
    '$date',
    '$numberInt',
    '$numberLong',
    '$numberDouble',
    '$numberDecimal',
    '$regularExpression',
    '$binary',
    '$timestamp',
];

const containsExtendedJsonMarkers = (text: string): boolean => (
    EXTENDED_JSON_KEYS.some((marker) => text.includes(`"${marker}"`))
);

const deserializeIfJSON = (text: string) => {
    if (isJSON(text)) {
        // Most query filters are plain JSON. Parsing them with EJSON creates BSON wrapper
        // instances (for example around regex filters), which later conflict with the BSON
        // version bundled by MongoDB/Mongoose. Only use EJSON when the payload actually
        // contains Extended JSON markers such as $oid.
        if (containsExtendedJsonMarkers(text)) {
            return EJSON.parse(text) || undefined;
        }
        return JSON.parse(text) || undefined;
    }
    return text;
};

export default deserializeIfJSON;
