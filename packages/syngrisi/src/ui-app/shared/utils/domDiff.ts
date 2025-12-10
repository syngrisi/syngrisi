/**
 * DOM Diff Engine for RCA (Root Cause Analysis)
 *
 * Compares two DOM trees and identifies changes that may have caused visual regressions.
 * The algorithm:
 * 1. Build XPath maps for both trees
 * 2. Find removed nodes (in baseline, not in actual)
 * 3. Find added nodes (in actual, not in baseline)
 * 4. For matching nodes: compare geometry, styles, content
 * 5. Group changes into logical issues
 */

import {
    DOMNode,
    DOMChange,
    DOMChangeType,
    DOMDiffResult,
    LogicalIssue,
    PropertyChange,
    AffectedRegion,
    IssueSeverity,
} from '@shared/interfaces/IRCA';

/**
 * Generates a unique ID
 */
const generateId = (): string => Math.random().toString(36).substring(2, 11);

/**
 * Builds an XPath for a node based on its position in the tree
 */
function buildXPath(node: DOMNode, parentPath: string = ''): string {
    const tagName = node.tagName.toLowerCase();
    const id = node.attributes?.id;

    if (id) {
        return `//${tagName}[@id="${id}"]`;
    }

    const className = node.attributes?.class;
    if (className) {
        const classes = className.split(' ').filter(Boolean).join('.');
        if (classes) {
            return `${parentPath}/${tagName}.${classes}`;
        }
    }

    return `${parentPath}/${tagName}`;
}

/**
 * Traverses a DOM tree and builds a map of xpath -> node
 */
function buildNodeMap(
    node: DOMNode,
    path: string = '',
    map: Map<string, DOMNode> = new Map(),
    indexMap: Map<string, number> = new Map()
): Map<string, DOMNode> {
    const basePath = buildXPath(node, path);

    // Handle siblings with same tag/class by adding index
    const countKey = basePath;
    const currentIndex = (indexMap.get(countKey) || 0) + 1;
    indexMap.set(countKey, currentIndex);

    const finalPath = currentIndex > 1 ? `${basePath}[${currentIndex}]` : basePath;
    map.set(finalPath, node);

    // Process children
    const childIndexMap = new Map<string, number>();
    for (const child of node.children || []) {
        buildNodeMap(child, finalPath, map, childIndexMap);
    }

    return map;
}

/**
 * Compares two rect objects for significant differences
 */
function compareGeometry(baseline: DOMNode, actual: DOMNode): PropertyChange[] {
    const changes: PropertyChange[] = [];
    const threshold = 1; // Allow 1px tolerance

    const props: Array<keyof typeof baseline.rect> = ['x', 'y', 'width', 'height'];
    for (const prop of props) {
        const baseVal = baseline.rect[prop];
        const actVal = actual.rect[prop];

        if (Math.abs(baseVal - actVal) > threshold) {
            changes.push({
                property: `rect.${prop}`,
                baselineValue: `${baseVal}px`,
                actualValue: `${actVal}px`,
            });
        }
    }

    return changes;
}

/**
 * List of important style properties to compare
 */
const IMPORTANT_STYLES = [
    'display',
    'visibility',
    'opacity',
    'position',
    'width',
    'height',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'background-color',
    'color',
    'font-family',
    'font-size',
    'font-weight',
    'line-height',
    'text-align',
    'overflow',
    'z-index',
    'transform',
    'flex-direction',
    'justify-content',
    'align-items',
];

/**
 * Compares computed styles between two nodes
 */
function compareStyles(baseline: DOMNode, actual: DOMNode): PropertyChange[] {
    const changes: PropertyChange[] = [];

    for (const prop of IMPORTANT_STYLES) {
        const baseVal = baseline.computedStyles?.[prop] || '';
        const actVal = actual.computedStyles?.[prop] || '';

        if (baseVal !== actVal) {
            changes.push({
                property: prop,
                baselineValue: baseVal || '(not set)',
                actualValue: actVal || '(not set)',
            });
        }
    }

    return changes;
}

/**
 * Compares text content between two nodes
 */
function compareContent(baseline: DOMNode, actual: DOMNode): PropertyChange[] {
    const changes: PropertyChange[] = [];

    const baseText = baseline.text?.trim() || '';
    const actText = actual.text?.trim() || '';

    if (baseText !== actText) {
        changes.push({
            property: 'textContent',
            baselineValue: baseText || '(empty)',
            actualValue: actText || '(empty)',
        });
    }

    return changes;
}

/**
 * Creates an affected region from a node's rect
 */
function createRegionFromNode(node: DOMNode): AffectedRegion {
    return {
        x: node.rect.x,
        y: node.rect.y,
        width: node.rect.width,
        height: node.rect.height,
    };
}

/**
 * Main diff function - compares two DOM trees
 */
export function diffDOMTrees(
    baseline: DOMNode | null,
    actual: DOMNode | null
): DOMDiffResult {
    const changes: DOMChange[] = [];
    const stats = {
        totalChanges: 0,
        addedNodes: 0,
        removedNodes: 0,
        styleChanges: 0,
        contentChanges: 0,
        geometryChanges: 0,
    };

    if (!baseline || !actual) {
        return { changes, issues: [], stats };
    }

    // Build xpath -> node maps
    const baselineMap = buildNodeMap(baseline);
    const actualMap = buildNodeMap(actual);

    // Find removed nodes (in baseline but not in actual)
    for (const [xpath, baseNode] of baselineMap) {
        if (!actualMap.has(xpath)) {
            changes.push({
                id: generateId(),
                type: 'removed',
                xpath,
                baselineNode: baseNode,
                affectedVisualRegions: [createRegionFromNode(baseNode)],
            });
            stats.removedNodes++;
        }
    }

    // Find added nodes (in actual but not in baseline)
    for (const [xpath, actNode] of actualMap) {
        if (!baselineMap.has(xpath)) {
            changes.push({
                id: generateId(),
                type: 'added',
                xpath,
                actualNode: actNode,
                affectedVisualRegions: [createRegionFromNode(actNode)],
            });
            stats.addedNodes++;
        }
    }

    // Compare matching nodes
    for (const [xpath, baseNode] of baselineMap) {
        const actNode = actualMap.get(xpath);
        if (!actNode) continue;

        const changedProperties: PropertyChange[] = [];
        let changeType: DOMChangeType | null = null;

        // Compare geometry
        const geometryChanges = compareGeometry(baseNode, actNode);
        if (geometryChanges.length > 0) {
            changedProperties.push(...geometryChanges);
            changeType = 'geometry_changed';
            stats.geometryChanges++;
        }

        // Compare styles
        const styleChanges = compareStyles(baseNode, actNode);
        if (styleChanges.length > 0) {
            changedProperties.push(...styleChanges);
            changeType = 'style_changed';
            stats.styleChanges++;
        }

        // Compare content
        const contentChanges = compareContent(baseNode, actNode);
        if (contentChanges.length > 0) {
            changedProperties.push(...contentChanges);
            changeType = 'content_changed';
            stats.contentChanges++;
        }

        // If multiple types of changes, prioritize style changes
        if (styleChanges.length > 0) {
            changeType = 'style_changed';
        }

        if (changedProperties.length > 0 && changeType) {
            changes.push({
                id: generateId(),
                type: changeType,
                xpath,
                baselineNode: baseNode,
                actualNode: actNode,
                changedProperties,
                affectedVisualRegions: [
                    createRegionFromNode(baseNode),
                    createRegionFromNode(actNode),
                ],
            });
        }
    }

    stats.totalChanges = changes.length;

    // Group changes into logical issues
    const issues = groupChangesIntoIssues(changes);

    return { changes, issues, stats };
}

/**
 * Groups related changes into logical issues for better understanding
 */
export function groupChangesIntoIssues(changes: DOMChange[]): LogicalIssue[] {
    const issues: LogicalIssue[] = [];
    const processedChangeIds = new Set<string>();

    // Group by changed CSS property
    const propertyGroups = new Map<string, DOMChange[]>();

    for (const change of changes) {
        if (change.type === 'style_changed' && change.changedProperties) {
            for (const prop of change.changedProperties) {
                const key = prop.property;
                if (!propertyGroups.has(key)) {
                    propertyGroups.set(key, []);
                }
                propertyGroups.get(key)!.push(change);
            }
        }
    }

    // Create issues for property groups with multiple changes
    for (const [property, groupChanges] of propertyGroups) {
        if (groupChanges.length >= 2) {
            const uniqueChanges = groupChanges.filter(c => !processedChangeIds.has(c.id));
            if (uniqueChanges.length >= 2) {
                const allRegions: AffectedRegion[] = [];
                for (const c of uniqueChanges) {
                    allRegions.push(...c.affectedVisualRegions);
                    processedChangeIds.add(c.id);
                }

                issues.push({
                    id: generateId(),
                    rootCause: `Multiple elements have changed "${property}"`,
                    description: `${uniqueChanges.length} elements have different "${property}" values`,
                    affectedChanges: uniqueChanges,
                    visualRegions: allRegions,
                    severity: determineSeverity(property),
                });
            }
        }
    }

    // Create individual issues for remaining changes
    for (const change of changes) {
        if (!processedChangeIds.has(change.id)) {
            issues.push({
                id: generateId(),
                rootCause: getRootCauseDescription(change),
                description: getChangeDescription(change),
                affectedChanges: [change],
                visualRegions: change.affectedVisualRegions,
                severity: getChangeSeverity(change),
            });
            processedChangeIds.add(change.id);
        }
    }

    // Sort by severity
    issues.sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
    });

    return issues;
}

/**
 * Determines severity based on the property that changed
 */
function determineSeverity(property: string): IssueSeverity {
    const highSeverity = ['display', 'visibility', 'position', 'width', 'height'];
    const mediumSeverity = ['margin', 'padding', 'font-size', 'color', 'background-color'];

    if (highSeverity.some(p => property.includes(p))) return 'high';
    if (mediumSeverity.some(p => property.includes(p))) return 'medium';
    return 'low';
}

/**
 * Gets the severity of a single change
 */
function getChangeSeverity(change: DOMChange): IssueSeverity {
    switch (change.type) {
        case 'added':
        case 'removed':
            return 'high';
        case 'style_changed':
            if (change.changedProperties?.some(p =>
                ['display', 'visibility', 'position'].includes(p.property)
            )) {
                return 'high';
            }
            return 'medium';
        case 'geometry_changed':
            return 'medium';
        case 'content_changed':
            return 'low';
        default:
            return 'low';
    }
}

/**
 * Gets a human-readable root cause description
 */
function getRootCauseDescription(change: DOMChange): string {
    switch (change.type) {
        case 'added':
            return `New element added: ${change.actualNode?.tagName}`;
        case 'removed':
            return `Element removed: ${change.baselineNode?.tagName}`;
        case 'style_changed':
            const styleProp = change.changedProperties?.[0]?.property || 'style';
            return `Style changed: ${styleProp}`;
        case 'geometry_changed':
            return 'Element position or size changed';
        case 'content_changed':
            return 'Text content changed';
        default:
            return 'Unknown change';
    }
}

/**
 * Gets a detailed change description
 */
function getChangeDescription(change: DOMChange): string {
    switch (change.type) {
        case 'added':
            return `A new ${change.actualNode?.tagName || 'element'} was added to the page`;
        case 'removed':
            return `The ${change.baselineNode?.tagName || 'element'} was removed from the page`;
        case 'style_changed':
            if (change.changedProperties?.length === 1) {
                const p = change.changedProperties[0];
                return `${p.property} changed from "${p.baselineValue}" to "${p.actualValue}"`;
            }
            return `${change.changedProperties?.length || 0} style properties changed`;
        case 'geometry_changed':
            return 'Element bounds (position/size) have changed';
        case 'content_changed':
            return 'Text content has been modified';
        default:
            return 'Element has changed';
    }
}

/**
 * Finds a node by coordinates in the DOM tree
 */
export function findNodeAtPoint(
    root: DOMNode,
    x: number,
    y: number
): DOMNode | null {
    let result: DOMNode | null = null;
    let smallestArea = Infinity;

    function traverse(node: DOMNode) {
        const { rect } = node;
        if (
            x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height
        ) {
            const area = rect.width * rect.height;
            if (area < smallestArea) {
                smallestArea = area;
                result = node;
            }

            // Check children for more specific match
            for (const child of node.children || []) {
                traverse(child);
            }
        }
    }

    traverse(root);
    return result;
}

/**
 * Builds a breadcrumb path for a node
 */
export function getNodeBreadcrumb(node: DOMNode, root: DOMNode): string[] {
    const breadcrumb: string[] = [];

    function findPath(current: DOMNode, target: DOMNode, path: string[]): boolean {
        const label = current.tagName.toLowerCase() +
            (current.attributes?.id ? `#${current.attributes.id}` : '') +
            (current.attributes?.class ? `.${current.attributes.class.split(' ')[0]}` : '');

        path.push(label);

        if (current === target) {
            return true;
        }

        for (const child of current.children || []) {
            if (findPath(child, target, path)) {
                return true;
            }
        }

        path.pop();
        return false;
    }

    findPath(root, node, breadcrumb);
    return breadcrumb;
}
