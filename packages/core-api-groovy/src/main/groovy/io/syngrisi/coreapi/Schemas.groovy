package io.syngrisi.coreapi

import groovy.json.JsonOutput

/**
 * Manual validation that mirrors the zod schemas from the JS package.
 * Each guard throws IllegalArgumentException on invalid input, matching zod's
 * "throw on invalid" behaviour (paramsGuard in the JS utils).
 */
class Schemas {

    static final int DOM_DUMP_COMPRESSION_THRESHOLD = 50 * 1024

    /**
     * CSS properties to capture for RCA analysis.
     * Mirrors STYLES_TO_CAPTURE from DomNode.schema.ts (camelCase variant).
     */
    static final List<String> STYLES_TO_CAPTURE = [
            // Display & Visibility
            'display', 'visibility', 'opacity',
            // Position
            'position', 'top', 'right', 'bottom', 'left',
            // Dimensions
            'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
            // Box Model
            'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
            'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
            'border', 'borderWidth', 'borderStyle', 'borderColor',
            'borderRadius',
            // Colors
            'backgroundColor', 'color',
            // Typography
            'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'textAlign',
            'textDecoration', 'textTransform', 'letterSpacing',
            // Layout
            'overflow', 'overflowX', 'overflowY',
            'zIndex',
            'transform',
            // Flexbox
            'flex', 'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignContent', 'gap',
            // Grid
            'gridTemplateColumns', 'gridTemplateRows', 'gridGap',
            // Box Shadow
            'boxShadow',
    ].asImmutable()

    private static final java.util.regex.Pattern VIEWPORT_REGEX = ~/^\d+x\d+$/

    private static void fail(String functionName, String detail, Object params) {
        throw new IllegalArgumentException(
                "Invalid '${functionName}' parameters: ${detail}\n params: ${JsonOutput.toJson(params)}".toString())
    }

    private static boolean isNonEmptyString(Object v) {
        return (v instanceof CharSequence) && v.toString().length() > 0
    }

    private static void requireNonEmptyString(Map params, String key, String functionName) {
        if (!isNonEmptyString(params[key])) {
            fail(functionName, "field '${key}' must be a non-empty string", params)
        }
    }

    private static void requireString(Map params, String key, String functionName) {
        if (!(params[key] instanceof CharSequence)) {
            fail(functionName, "field '${key}' must be a string", params)
        }
    }

    private static void requireViewport(Map params, String key, String functionName) {
        Object v = params[key]
        if (!isNonEmptyString(v) || v.toString().length() < 3 || !VIEWPORT_REGEX.matcher(v.toString()).matches()) {
            fail(functionName, "field '${key}' must match viewport format WxH (e.g. '1200x800')", params)
        }
    }

    private static void requireIdString(Map params, String key, String functionName) {
        Object v = params[key]
        if (!(v instanceof CharSequence) || v.toString().length() != 24) {
            fail(functionName, "field '${key}' must be a 24-character id string", params)
        }
    }

    private static void requireStringOrNumber(Map params, String key, String functionName) {
        Object v = params[key]
        if (v instanceof Number) {
            return
        }
        if (!isNonEmptyString(v)) {
            fail(functionName, "field '${key}' must be a non-empty string or a number", params)
        }
    }

    /** ConfigSchema: url non-empty str; apiKey optional str; headers optional map<str,str>. */
    static void validateConfig(Map cfg, String functionName) {
        if (cfg == null) {
            fail(functionName, 'config must be provided', cfg)
        }
        requireNonEmptyString(cfg, 'url', functionName)
        if (cfg.containsKey('apiKey') && cfg.apiKey != null && !(cfg.apiKey instanceof CharSequence)) {
            fail(functionName, "field 'apiKey' must be a string", cfg)
        }
        if (cfg.containsKey('headers') && cfg.headers != null) {
            if (!(cfg.headers instanceof Map)) {
                fail(functionName, "field 'headers' must be a map", cfg)
            }
            (cfg.headers as Map).each { k, v ->
                if (!(k instanceof CharSequence) || !(v instanceof CharSequence)) {
                    fail(functionName, "field 'headers' must be a map of string->string", cfg)
                }
            }
        }
    }

    /** ApiSessionParamsSchema. */
    static void validateApiSessionParams(Map params, String functionName) {
        if (params == null) {
            fail(functionName, 'params must be provided', params)
        }
        requireNonEmptyString(params, 'run', functionName)
        requireNonEmptyString(params, 'suite', functionName)
        requireNonEmptyString(params, 'runident', functionName)
        requireNonEmptyString(params, 'name', functionName)
        requireViewport(params, 'viewport', functionName)
        requireNonEmptyString(params, 'browser', functionName)
        requireStringOrNumber(params, 'browserVersion', functionName)
        requireNonEmptyString(params, 'browserFullVersion', functionName)
        requireString(params, 'os', functionName)
        requireString(params, 'app', functionName)
        if (params.containsKey('tags') && params.tags != null) {
            if (!(params.tags instanceof List) || !(params.tags as List).every { it instanceof CharSequence }) {
                fail(functionName, "field 'tags' must be an array of strings", params)
            }
        }
        requireString(params, 'branch', functionName)
    }

    /** CheckParamsSchema. */
    static void validateCheckParams(Map params, String functionName) {
        if (params == null) {
            fail(functionName, 'params must be provided', params)
        }
        requireNonEmptyString(params, 'name', functionName)
        requireViewport(params, 'viewport', functionName)
        requireNonEmptyString(params, 'browserName', functionName)
        requireNonEmptyString(params, 'os', functionName)
        requireNonEmptyString(params, 'app', functionName)
        requireNonEmptyString(params, 'branch', functionName)
        requireIdString(params, 'testId', functionName)
        requireNonEmptyString(params, 'suite', functionName)
        requireStringOrNumber(params, 'browserVersion', functionName)
        requireNonEmptyString(params, 'browserFullVersion', functionName)
        Object hashCode = params.hashCode
        if (!(hashCode instanceof CharSequence) || hashCode.toString().length() < 64) {
            fail(functionName, "field 'hashCode' must be a string of at least 64 chars", params)
        }
        if (params.containsKey('skipDomData') && params.skipDomData != null && !(params.skipDomData instanceof Boolean)) {
            fail(functionName, "field 'skipDomData' must be a boolean", params)
        }
        if (params.containsKey('toleranceThreshold') && params.toleranceThreshold != null) {
            Object t = params.toleranceThreshold
            if (!(t instanceof Number) || (t as Number).doubleValue() < 0 || (t as Number).doubleValue() > 100) {
                fail(functionName, "field 'toleranceThreshold' must be a number between 0 and 100", params)
            }
        }
    }

    /** BaselineParamsSchema. */
    static void validateBaselineParams(Map params, String functionName) {
        if (params == null) {
            fail(functionName, 'params must be provided', params)
        }
        requireNonEmptyString(params, 'name', functionName)
        requireViewport(params, 'viewport', functionName)
        requireNonEmptyString(params, 'browserName', functionName)
        requireNonEmptyString(params, 'os', functionName)
        requireNonEmptyString(params, 'app', functionName)
        requireNonEmptyString(params, 'branch', functionName)
    }

    /** SnapshotSchema: all fields optional. */
    static void validateSnapshot(Map params, String functionName) {
        if (params == null) {
            fail(functionName, 'params must be provided', params)
        }
        if (params.containsKey('_id') && params._id != null) {
            requireIdString(params, '_id', functionName)
        }
        if (params.containsKey('name') && params.name != null) {
            requireNonEmptyString(params, 'name', functionName)
        }
        if (params.containsKey('filename') && params.filename != null) {
            requireNonEmptyString(params, 'filename', functionName)
        }
        if (params.containsKey('imghash') && params.imghash != null) {
            Object v = params.imghash
            if (!(v instanceof CharSequence) || v.toString().length() != 128) {
                fail(functionName, "field 'imghash' must be a 128-character string", params)
            }
        }
        if (params.containsKey('createdDate') && params.createdDate != null) {
            if (!(params.createdDate instanceof Date)) {
                fail(functionName, "field 'createdDate' must be a Date", params)
            }
        }
    }
}
