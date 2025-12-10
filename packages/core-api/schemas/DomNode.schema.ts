import { z } from 'zod'

/**
 * Schema for element positioning (bounding rect)
 */
export const DomRectSchema = z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
})

export type DomRect = z.infer<typeof DomRectSchema>

/**
 * Recursive DomNode type for TypeScript
 * Represents a DOM element with its visual properties for RCA analysis
 */
export interface DomNode {
    tagName: string;
    attributes: Record<string, string>;
    rect: DomRect;
    computedStyles: Record<string, string>;
    children: DomNode[];
    text?: string;
}

/**
 * Base schema without recursive children (for composition)
 */
const DomNodeBaseSchema = z.object({
    tagName: z.string().min(1),
    attributes: z.record(z.string(), z.string()),
    rect: DomRectSchema,
    computedStyles: z.record(z.string(), z.string()),
    text: z.string().optional(),
})

/**
 * Recursive DomNode schema using lazy evaluation
 * Note: For deep validation, consider using z.any() for children
 * as deeply nested structures can impact performance
 */
export const DomNodeSchema: z.ZodType<DomNode> = DomNodeBaseSchema.extend({
    children: z.lazy(() => z.array(DomNodeSchema)),
})

/**
 * Compressed DomDump format for efficient transfer
 */
export const CompressedDomDumpSchema = z.object({
    data: z.string(), // base64 encoded gzip data
    compressed: z.literal(true),
    originalSize: z.number(),
})

export type CompressedDomDump = z.infer<typeof CompressedDomDumpSchema>

/**
 * DomDump can be either a DomNode tree or compressed format
 */
export const DomDumpSchema = z.union([
    DomNodeSchema,
    CompressedDomDumpSchema,
])

export type DomDump = z.infer<typeof DomDumpSchema>

/**
 * Compression threshold in bytes (50KB)
 * DOM dumps larger than this will be compressed
 */
export const DOM_DUMP_COMPRESSION_THRESHOLD = 50 * 1024

/**
 * CSS properties to capture for RCA analysis
 * These properties are most likely to cause visual differences
 */
export const STYLES_TO_CAPTURE = [
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
] as const

export type CapturedStyle = typeof STYLES_TO_CAPTURE[number]
