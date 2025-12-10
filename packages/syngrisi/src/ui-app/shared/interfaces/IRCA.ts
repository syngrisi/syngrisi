/**
 * RCA (Root Cause Analysis) Types and Interfaces
 *
 * These types define the structures used for DOM diff analysis
 * to identify the root cause of visual regressions.
 */

/**
 * Bounding rectangle of a DOM element
 */
export interface DOMRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * DOM node representation as captured from the browser
 */
export interface DOMNode {
    tagName: string;
    attributes: Record<string, string>;
    rect: DOMRect;
    computedStyles: Record<string, string>;
    children: DOMNode[];
    text?: string;
}

/**
 * Visual region affected by a DOM change
 */
export interface AffectedRegion {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Property change details
 */
export interface PropertyChange {
    property: string;
    baselineValue: string;
    actualValue: string;
}

/**
 * Types of DOM changes that can occur
 */
export type DOMChangeType =
    | 'added'
    | 'removed'
    | 'style_changed'
    | 'content_changed'
    | 'geometry_changed';

/**
 * Represents a change between baseline and actual DOM
 */
export interface DOMChange {
    id: string;
    type: DOMChangeType;
    xpath: string;
    baselineNode?: DOMNode;
    actualNode?: DOMNode;
    changedProperties?: PropertyChange[];
    affectedVisualRegions: AffectedRegion[];
}

/**
 * Severity levels for logical issues
 */
export type IssueSeverity = 'high' | 'medium' | 'low';

/**
 * A logical issue grouping related DOM changes
 */
export interface LogicalIssue {
    id: string;
    rootCause: string;
    description: string;
    affectedChanges: DOMChange[];
    visualRegions: AffectedRegion[];
    severity: IssueSeverity;
}

/**
 * Result of DOM diff analysis
 */
export interface DOMDiffResult {
    changes: DOMChange[];
    issues: LogicalIssue[];
    stats: {
        totalChanges: number;
        addedNodes: number;
        removedNodes: number;
        styleChanges: number;
        contentChanges: number;
        geometryChanges: number;
    };
}

/**
 * RCA context state
 */
export interface RCAState {
    isEnabled: boolean;
    isPanelOpen: boolean;
    isLoading: boolean;
    error: string | null;
    baselineDom: DOMNode | null;
    actualDom: DOMNode | null;
    diffResult: DOMDiffResult | null;
    selectedElement: DOMNode | null;
    selectedChange: DOMChange | null;
    hoveredElement: DOMNode | null;
}

/**
 * RCA panel mode
 */
export type RCAPanelMode = 'element' | 'issues';

/**
 * Props for RCA panel components
 */
export interface RCAPanelProps {
    selectedChange: DOMChange | null;
    selectedElement: DOMNode | null;
    changes: DOMChange[];
    issues: LogicalIssue[];
    mode: RCAPanelMode;
    onSelectChange: (change: DOMChange | null) => void;
    onModeChange: (mode: RCAPanelMode) => void;
}

/**
 * RCA overlay configuration
 */
export interface RCAOverlayConfig {
    highlightColor: string;
    addedColor: string;
    removedColor: string;
    changedColor: string;
    strokeWidth: number;
    fillOpacity: number;
}

/**
 * Default overlay configuration
 */
export const DEFAULT_RCA_OVERLAY_CONFIG: RCAOverlayConfig = {
    highlightColor: '#3498db',
    addedColor: '#27ae60',
    removedColor: '#e74c3c',
    changedColor: '#f39c12',
    strokeWidth: 2,
    fillOpacity: 0.15,
};
