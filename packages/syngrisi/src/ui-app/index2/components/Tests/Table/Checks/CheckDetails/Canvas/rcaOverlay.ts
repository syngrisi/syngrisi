/**
 * RCA (Root Cause Analysis) Overlay for Canvas
 *
 * Provides visual highlighting of DOM elements on the canvas
 * to support the RCA feature.
 */

import { fabric } from 'fabric';
import {
    DOMNode,
    DOMChange,
    RCAOverlayConfig,
    DEFAULT_RCA_OVERLAY_CONFIG,
} from '@shared/interfaces/IRCA';
import { findNodeAtPoint } from '@shared/utils/domDiff';

export interface RCAOverlayCallbacks {
    onElementHover?: (node: DOMNode | null) => void;
    onElementClick?: (node: DOMNode | null, change: DOMChange | null) => void;
}

export class RCAOverlay {
    private canvas: fabric.Canvas;
    private enabled: boolean = false;
    private config: RCAOverlayConfig;
    private callbacks: RCAOverlayCallbacks;

    private actualDom: DOMNode | null = null;
    private baselineDom: DOMNode | null = null;
    private changes: DOMChange[] = [];

    private highlightRect: fabric.Rect | null = null;
    private changeRects: fabric.Rect[] = [];
    private wireframeRects: fabric.Rect[] = [];

    private imageScale: number = 1;
    private imageOffsetX: number = 0;
    private imageOffsetY: number = 0;
    private isWireframeVisible: boolean = false;

    constructor(
        canvas: fabric.Canvas,
        callbacks: RCAOverlayCallbacks = {},
        config: RCAOverlayConfig = DEFAULT_RCA_OVERLAY_CONFIG
    ) {
        this.canvas = canvas;
        this.callbacks = callbacks;
        this.config = config;
    }

    /**
     * Enable the RCA overlay
     */
    enable(
        actualDom: DOMNode | null,
        baselineDom: DOMNode | null,
        changes: DOMChange[],
        imageScale: number = 1,
        imageOffsetX: number = 0,
        imageOffsetY: number = 0,
        showWireframe: boolean = false
    ): void {
        this.actualDom = actualDom;
        this.baselineDom = baselineDom;
        this.changes = changes;
        this.imageScale = imageScale;
        this.imageOffsetX = imageOffsetX;
        this.imageOffsetY = imageOffsetY;
        this.isWireframeVisible = showWireframe;

        this.enabled = true;
        this.bindEvents();
        this.renderChangeHighlights();
        if (this.isWireframeVisible) {
            this.renderWireframe();
        }
    }

    /**
     * Disable the RCA overlay
     */
    disable(): void {
        this.enabled = false;
        this.unbindEvents();
        this.clearHighlight();
        this.clearChangeHighlights();
        this.clearWireframe();
        this.actualDom = null;
        this.baselineDom = null;
        this.changes = [];
    }

    /**
     * Check if overlay is enabled
     */
    isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Update image transformation parameters
     */
    updateImageTransform(scale: number, offsetX: number, offsetY: number): void {
        this.imageScale = scale;
        this.imageOffsetX = offsetX;
        this.imageOffsetY = offsetY;

        if (this.enabled) {
            this.renderChangeHighlights();
            if (this.isWireframeVisible) {
                this.renderWireframe();
            }
        }
    }

    /**
     * Toggle wireframe visibility
     */
    toggleWireframe(visible: boolean): void {
        this.isWireframeVisible = visible;
        if (this.enabled) {
            if (visible) {
                this.renderWireframe();
            } else {
                this.clearWireframe();
            }
        }
    }

    /**
     * Highlight a specific DOM change
     */
    highlightChange(change: DOMChange | null): void {
        this.clearHighlight();

        if (!change || !this.enabled) return;

        const node = change.actualNode || change.baselineNode;
        if (!node) return;

        this.createHighlightRect(node, this.getColorForChangeType(change.type));
    }

    /**
     * Highlight a specific node
     */
    highlightNode(node: DOMNode | null): void {
        this.clearHighlight();

        if (!node || !this.enabled) return;

        this.createHighlightRect(node, this.config.highlightColor);
    }

    /**
     * Bind canvas events for mouse interaction
     */
    private bindEvents(): void {
        this.canvas.on('mouse:move', this.handleMouseMove);
        this.canvas.on('mouse:down', this.handleMouseClick);
    }

    /**
     * Unbind canvas events
     */
    private unbindEvents(): void {
        this.canvas.off('mouse:move', this.handleMouseMove);
        this.canvas.off('mouse:down', this.handleMouseClick);
    }

    /**
     * Handle mouse move for hover highlighting
     */
    private handleMouseMove = (event: fabric.IEvent<MouseEvent>): void => {
        if (!this.enabled || !this.actualDom) return;

        const pointer = this.canvas.getPointer(event.e);
        const domX = this.canvasToDomX(pointer.x);
        const domY = this.canvasToDomY(pointer.y);

        const hoveredNode = findNodeAtPoint(this.actualDom, domX, domY);

        if (hoveredNode) {
            this.canvas.defaultCursor = 'pointer';
            this.highlightNode(hoveredNode);
            this.callbacks.onElementHover?.(hoveredNode);
        } else {
            this.canvas.defaultCursor = 'default';
            this.clearHighlight();
            this.callbacks.onElementHover?.(null);
        }
    };

    /**
     * Handle mouse click for element selection
     */
    private handleMouseClick = (event: fabric.IEvent<MouseEvent>): void => {
        if (!this.enabled || !this.actualDom) return;

        // Only handle left click
        if (event.e.button !== 0) return;

        const pointer = this.canvas.getPointer(event.e);
        const domX = this.canvasToDomX(pointer.x);
        const domY = this.canvasToDomY(pointer.y);

        const clickedNode = findNodeAtPoint(this.actualDom, domX, domY);

        // Find if this node has an associated change
        const associatedChange = clickedNode
            ? this.findChangeForNode(clickedNode)
            : null;

        this.callbacks.onElementClick?.(clickedNode, associatedChange);
    };

    /**
     * Find a change associated with a node
     */
    private findChangeForNode(node: DOMNode): DOMChange | null {
        // Check by matching rect bounds (within tolerance)
        const tolerance = 5;

        for (const change of this.changes) {
            const changeNode = change.actualNode || change.baselineNode;
            if (!changeNode) continue;

            if (
                Math.abs(changeNode.rect.x - node.rect.x) < tolerance &&
                Math.abs(changeNode.rect.y - node.rect.y) < tolerance &&
                Math.abs(changeNode.rect.width - node.rect.width) < tolerance &&
                Math.abs(changeNode.rect.height - node.rect.height) < tolerance
            ) {
                return change;
            }
        }

        return null;
    }

    /**
     * Convert canvas X coordinate to DOM coordinate
     */
    private canvasToDomX(canvasX: number): number {
        return (canvasX - this.imageOffsetX) / this.imageScale;
    }

    /**
     * Convert canvas Y coordinate to DOM coordinate
     */
    private canvasToDomY(canvasY: number): number {
        return (canvasY - this.imageOffsetY) / this.imageScale;
    }

    /**
     * Convert DOM coordinates to canvas coordinates
     */
    private domToCanvas(rect: { x: number; y: number; width: number; height: number }): {
        left: number;
        top: number;
        width: number;
        height: number;
    } {
        return {
            left: rect.x * this.imageScale + this.imageOffsetX,
            top: rect.y * this.imageScale + this.imageOffsetY,
            width: rect.width * this.imageScale,
            height: rect.height * this.imageScale,
        };
    }

    /**
     * Create a highlight rectangle for a node
     */
    private createHighlightRect(node: DOMNode, color: string): void {
        const canvasRect = this.domToCanvas(node.rect);

        this.highlightRect = new fabric.Rect({
            left: canvasRect.left,
            top: canvasRect.top,
            width: canvasRect.width,
            height: canvasRect.height,
            fill: `${color}${Math.round(this.config.fillOpacity * 255).toString(16).padStart(2, '0')}`,
            stroke: color,
            strokeWidth: this.config.strokeWidth,
            selectable: false,
            evented: false,
            name: 'rca_highlight',
        });

        this.canvas.add(this.highlightRect);
        this.highlightRect.bringToFront();
        this.canvas.renderAll();
    }

    /**
     * Clear the current highlight
     */
    private clearHighlight(): void {
        if (this.highlightRect) {
            this.canvas.remove(this.highlightRect);
            this.highlightRect = null;
            this.canvas.renderAll();
        }
    }

    /**
     * Render highlights for all changes
     */
    private renderChangeHighlights(): void {
        this.clearChangeHighlights();

        for (const change of this.changes) {
            const node = change.actualNode || change.baselineNode;
            if (!node) continue;

            const canvasRect = this.domToCanvas(node.rect);
            const color = this.getColorForChangeType(change.type);

            const rect = new fabric.Rect({
                left: canvasRect.left,
                top: canvasRect.top,
                width: canvasRect.width,
                height: canvasRect.height,
                fill: 'transparent',
                stroke: color,
                strokeWidth: 1,
                strokeDashArray: [4, 4],
                selectable: false,
                evented: false,
                name: 'rca_change_highlight',
            });

            this.changeRects.push(rect);
            this.canvas.add(rect);
        }

        this.canvas.renderAll();
    }

    /**
     * Clear all change highlights
     */
    private clearChangeHighlights(): void {
        for (const rect of this.changeRects) {
            this.canvas.remove(rect);
        }
        this.changeRects = [];
        this.canvas.renderAll();
    }

    /**
     * Render wireframe for all elements
     */
    private renderWireframe(): void {
        this.clearWireframe();
        if (!this.actualDom) return;

        const traverse = (node: DOMNode) => {
            // Skip if node has no dimensions
            if (node.rect.width > 0 && node.rect.height > 0) {
                const canvasRect = this.domToCanvas(node.rect);
                
                const rect = new fabric.Rect({
                    left: canvasRect.left,
                    top: canvasRect.top,
                    width: canvasRect.width,
                    height: canvasRect.height,
                    fill: 'transparent',
                    stroke: 'rgba(0, 150, 255, 0.2)',
                    strokeWidth: 1,
                    selectable: false,
                    evented: false,
                    name: 'rca_wireframe',
                });

                this.wireframeRects.push(rect);
                this.canvas.add(rect);
                rect.sendToBack(); // Send to back so highlights are on top
            }

            if (node.children) {
                node.children.forEach(traverse);
            }
        };

        traverse(this.actualDom);
        this.canvas.renderAll();
    }

    /**
     * Clear wireframe
     */
    private clearWireframe(): void {
        for (const rect of this.wireframeRects) {
            this.canvas.remove(rect);
        }
        this.wireframeRects = [];
        this.canvas.renderAll();
    }

    /**
     * Get color for a change type
     */
    private getColorForChangeType(type: string): string {
        switch (type) {
            case 'added':
                return this.config.addedColor;
            case 'removed':
                return this.config.removedColor;
            case 'style_changed':
            case 'content_changed':
            case 'geometry_changed':
                return this.config.changedColor;
            default:
                return this.config.highlightColor;
        }
    }
}
