import mongoose from 'mongoose';
import isJSON from './isJSON';
import ApiError from './ApiError';
import HttpStatus from './httpStatus';

const { EJSON } = mongoose.mongo.BSON;

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

// Mongo operators a client is allowed to use in a `filter` query param (the UI builds
// Mongo-style filters with these). Anything else starting with '$' — $where, $expr,
// $function, $jsonSchema, ... — is rejected to block NoSQL operator injection.
const ALLOWED_OPERATORS = new Set([
    '$and', '$or', '$nor', '$not',
    '$eq', '$ne', '$in', '$nin',
    '$gt', '$gte', '$lt', '$lte',
    '$exists', '$type', '$size', '$all', '$elemMatch',
    '$regex', '$options',
]);

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    if (value === null || typeof value !== 'object') return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
};

// Recursively reject unknown $-operators in a client-supplied filter. Non-plain objects
// (ObjectId, Date, BSONRegExp produced by EJSON.parse) are values, not operators — skip them.
export const assertSafeMongoFilter = (value: unknown): void => {
    if (Array.isArray(value)) {
        value.forEach(assertSafeMongoFilter);
        return;
    }
    if (!isPlainObject(value)) return;
    for (const [key, nested] of Object.entries(value)) {
        if (key.startsWith('$') && !ALLOWED_OPERATORS.has(key)) {
            throw new ApiError(HttpStatus.BAD_REQUEST, `unsupported query operator: '${key}'`);
        }
        assertSafeMongoFilter(nested);
    }
};

const deserializeIfJSON = (text: string) => {
    if (isJSON(text)) {
        // Most query filters are plain JSON. Parsing them with EJSON creates BSON wrapper
        // instances (for example around regex filters), which later conflict with the BSON
        // version bundled by MongoDB/Mongoose. Only use EJSON when the payload actually
        // contains Extended JSON markers such as $oid.
        const parsed = containsExtendedJsonMarkers(text)
            ? EJSON.parse(text)
            : JSON.parse(text);
        // Every string that reaches this parser is a client-supplied Mongo filter, so this is
        // the single choke point where operator injection is blocked.
        assertSafeMongoFilter(parsed);
        return parsed || undefined;
    }
    return text;
};

export default deserializeIfJSON;
