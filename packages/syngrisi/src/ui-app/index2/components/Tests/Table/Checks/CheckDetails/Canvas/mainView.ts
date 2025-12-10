import { fabric } from 'fabric';
import { SimpleView } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/simpleView';
import { SideToSideView } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/sideToSideView';
import { lockImage } from '@index/components/Tests/Table/Checks/CheckDetails/Canvas/helpers';
import { errorMsg, successMsg } from '@shared/utils/utils';
import config from '@config';
import { log } from '@shared/utils/Logger';
import { highlightDiff, mergeNearbyGroups } from '@index/components/Tests/Table/Checks/CheckDetails/Toolbar/highlightDiff';
import { RCAOverlay, RCAOverlayCallbacks } from './rcaOverlay';
import { DOMNode, DOMChange } from '@shared/interfaces/IRCA';

/* eslint-disable dot-notation,no-underscore-dangle */
interface IRectParams {
    name: any;
    fill: any;
    stroke: any;
    strokeWidth: any;
    top: any;
    left: any;
    width: any;
    height: any;
}

interface Props {
    canvasElementWidth: number;
    canvasElementHeight: number;
    canvasId: string;
    // url: string
    actual: any;
    expectedImage: any;
    actualImage: any;
    diffImage: any;
}

export class MainView {
    canvasElementWidth: number;

    canvasElementHeight: number;

    sliderView: SideToSideView;

    canvas: fabric.Canvas;

    actualImage: any;

    currentMode: any;

    defaultMode: string;

    currentView: string;

    actualView: SimpleView;

    expectedView: SimpleView;

    diffView: SimpleView;

    expectedImage: any;

    diffImage: any;

    // Bounding region overlay state
    boundingOverlayEnabled: boolean = false;

    // RCA (Root Cause Analysis) overlay
    private rcaOverlay: RCAOverlay | null = null;

    private rcaCallbacks: RCAOverlayCallbacks = {};

    constructor(
        {
            canvasElementWidth,
            canvasElementHeight,
            canvasId,
            actual,
            expectedImage,
            actualImage,
            diffImage,
        }: Props,
    ) {
        fabric.Object.prototype.objectCaching = false;
        // init properties
        this.canvasElementWidth = canvasElementWidth;
        this.canvasElementHeight = canvasElementHeight;

        this.actualImage = lockImage(actualImage);
        this.expectedImage = lockImage(expectedImage);
        this.diffImage = diffImage ? lockImage(diffImage) : null;

        this.canvas = new fabric.Canvas(canvasId, {
            width: this.canvasElementWidth,
            height: this.canvasElementHeight,
            preserveObjectStacking: true,
            uniformScaling: false,
        });

        // this._currentView = 'actual';
        // this.expectedCanvasViewportAreaSize = MainView.calculateExpectedCanvasViewportAreaSize();

        this.defaultMode = '';

        // @ts-ignore - Expose mainView instance for E2E tests
        window.mainView = this;
        this.currentView = 'actual';

        if (actual) {
            this.sliderView = new SideToSideView(
                {
                    mainView: this,
                },
            );
        }

        // events
        this.selectionEvents();
        this.zoomEvents();
        this.panEvents();
        this.initBoundingOverlay();
        this.boundingRegionEvents();

        // Initialize RCA overlay
        this.rcaOverlay = new RCAOverlay(this.canvas, this.rcaCallbacks);

        // views
        this.expectedView = new SimpleView(this, 'expected');
        this.actualView = new SimpleView(this, 'actual');
        this.diffView = new SimpleView(this, 'diff');
        this.actualView.render();
        // this.sideToSideView.render()
    }

    /*
     this is the area from the left top canvas corner till the end of the viewport
     ┌──────┬─────────────┐
     │      │xxxxxxxx     │
     │      │xxxxxxxx     │
     │      │xxxxxxxx     │
     │      │xxxxxxxx     │
     │      │             │
     │      │             │
     │      │  the area   │
     │      │             │
     │      │             │
     └──────┴─────────────┘
    */

    static calculateExpectedCanvasViewportAreaSize() {
        const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        const canvasDimensions = document.getElementById('snapshoot')!
            .getBoundingClientRect();
        return {
            width: Number(viewportWidth - canvasDimensions.x),
            height: Number(viewportHeight - canvasDimensions.y),
        };
    }

    zoomEvents() {
        this.canvas.on('mouse:wheel', (opt: any) => {
            if (!opt.e.ctrlKey) return;
            const delta = opt.e.deltaY;
            let zoomVal = this.canvas.getZoom();

            zoomVal *= 0.999 ** delta;
            if (zoomVal > 9) zoomVal = 9;
            if (zoomVal < 0.01) zoomVal = 0.01;
            this.canvas.zoomToPoint({
                x: opt.e.offsetX,
                y: opt.e.offsetY,
            }, zoomVal);

            // Update RCA overlay transform
            this.updateRCATransform();

            // setZoomPercent(() => zoomVal * 100);
            document.dispatchEvent(new Event('zoom'));
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
    }

    panEvents() {
        this.canvas.on(
            'mouse:move', (e) => {
                // log.debug(e.e.buttons);
                if ((e.e.buttons === 4)) {
                    this.canvas.setCursor('grab');

                    const mEvent = e.e;
                    const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
                    this.canvas.relativePan(delta);
                    this.canvas.renderAll();

                    // Update RCA overlay transform
                    this.updateRCATransform();
                }
            },
        );

        this.canvas.on('mouse:wheel', (opt) => {
            if (opt.e.ctrlKey) return;
            const delta = new fabric.Point(-opt.e.deltaX / 2, -opt.e.deltaY / 2);
            this.canvas.relativePan(delta);
            // this.canvas.dispatchEvent(new Event('pan'));
            this.canvas.fire('pan', opt);
            this.canvas.renderAll();

            // Update RCA overlay transform
            this.updateRCATransform();

            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
    }

    selectionEvents() {
        // disable rotation point for selections
        this.canvas.on('selection:created', (e) => {
            const activeSelection: any = e.target;
            if (!activeSelection?._objects?.length || (activeSelection?._objects?.length < 2)) return;
            activeSelection.hasControls = false;
            this.canvas.renderAll();
        });

        // fired e.g. when you select one object first,
        // then add another via shift+click
        this.canvas.on('selection:updated', (e) => {
            const activeSelection: any = e.target;
            if (!activeSelection?._objects?.length || (activeSelection?._objects?.length < 2)) return;
            if (activeSelection.hasControls) {
                activeSelection.hasControls = false;
            }
        });
    }

    /**
     * Initialize bounding overlay rendering in the after:render event
     */
    initBoundingOverlay() {
        this.canvas.on('after:render', () => this.renderBoundingOverlay());
    }

    /**
     * Render semi-transparent overlay with a cutout for the bounding region
     * Uses evenodd fill rule to create the "hole" effect
     */
    renderBoundingOverlay() {
        if (!this.boundingOverlayEnabled) return;

        const boundRect = this.canvas.getObjects()
            .find((obj) => obj.name === 'bound_rect') as fabric.Rect;
        if (!boundRect) return;

        const ctx = this.canvas.getContext();
        const vpt = this.canvas.viewportTransform;

        ctx.save();
        ctx.beginPath();
        // Outer rectangle (entire canvas)
        ctx.rect(0, 0, this.canvas.width!, this.canvas.height!);
        // Apply viewport transform for correct zoom/pan handling
        ctx.transform(vpt![0], vpt![1], vpt![2], vpt![3], vpt![4], vpt![5]);
        // Inner rectangle (cutout) - the bounding region area
        ctx.rect(
            boundRect.left!,
            boundRect.top!,
            boundRect.getScaledWidth(),
            boundRect.getScaledHeight(),
        );
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill('evenodd');
        ctx.restore();
    }

    /**
     * Update bounding overlay state based on presence of bound_rect
     */
    updateBoundingOverlay() {
        const hasBoundRect = this.canvas.getObjects()
            .some((obj) => obj.name === 'bound_rect');
        this.boundingOverlayEnabled = hasBoundRect;
        this.canvas.requestRenderAll();
    }

    /**
     * Subscribe to bounding region events for real-time overlay updates
     */
    boundingRegionEvents() {
        // Update overlay during move/resize for real-time feedback
        this.canvas.on('object:moving', (e) => {
            if (e.target?.name === 'bound_rect') {
                this.canvas.requestRenderAll();
            }
        });

        this.canvas.on('object:scaling', (e) => {
            if (e.target?.name === 'bound_rect') {
                this.canvas.requestRenderAll();
            }
        });

        this.canvas.on('object:modified', (e) => {
            if (e.target?.name === 'bound_rect') {
                this.canvas.requestRenderAll();
            }
        });
    }

    // get objects() {
    //     return this.canvas.getObjects();
    // }

    async destroyAllViews() {
        this.expectedView.destroy();
        this.actualView.destroy();
        this.diffView.destroy();
        await this.sliderView.destroy();
    }

    async switchView(view: string) {
        this.currentView = view;
        await this.destroyAllViews();
        this.sliderView = new SideToSideView(
            {
                mainView: this,
            },
        );
        this[`${view}View`].render();
    }

    panToCanvasWidthCenter(imageName: string) {
        // if (this.pannedOnInit) return;
        // this.pannedOnInit = true;

        this.canvas.absolutePan(new fabric.Point(0, 0));
        const delta = new fabric.Point(
            ((this.canvas.width / 2)
                - ((this[imageName].width * this.canvas.getZoom()) / 2)
            ),
            // ((this.canvas.width / 2) - (this[imageName].getScaledWidth() / 2)),
            0,
        );
        this.canvas.relativePan(delta);
        // this.canvas.renderAll(); console.log('render!!!');
    }

    removeActiveIgnoreRegions() {
        const els = this.canvas.getActiveObjects()
            .filter((x) => x.name === 'ignore_rect');
        this.canvas.discardActiveObject()
            .renderAll();
        if (els.length === 0) {
            // eslint-disable-next-line no-undef,no-alert
            alert('there is no active regions for removing');
            return;
        }
        els.forEach((el) => {
            this.canvas.remove(el);
        });
        this.canvas.renderAll();
    }

    addRect(params: IRectParams) {
        // eslint-disable-next-line no-param-reassign
        params.name = params.name ? params.name : 'default_rect';
        let lastLeft = null;
        let lastTop = null;
        let width = null;
        let height = null;
        if ((this.getLastRegion() !== undefined) && (this.getLastRegion().name === 'ignore_rect')) {
            lastLeft = this.getLastRegion().left || 50;
            lastTop = this.getLastRegion().top;
            width = this.getLastRegion()
                .getScaledWidth();
            height = this.getLastRegion()
                .getScaledHeight();
        }
        // if last elements fit in current viewport create new region near this region
        const top = (lastTop > document.documentElement.scrollTop
            && lastTop < document.documentElement.scrollTop + window.innerHeight)
            ? lastTop + 20
            : document.documentElement.scrollTop + 50;
        const left = (lastLeft < (this.canvas.width - 80)) ? lastLeft + 20 : lastLeft - 50;
        return new fabric.Rect({
            left: params.left || left,
            top: params.top || top,
            fill: params.fill || 'blue',
            width: params.width || width || 200,
            height: params.height || height || 100,
            strokeWidth: params.strokeWidth || 2,
            // stroke: params.stroke || 'rgba(100,200,200,0.5)',
            stroke: params.stroke || 'black',
            opacity: 0.5,
            name: params.name,
            // uniformScaling: true,
            strokeUniform: true,
            noScaleCache: false,
            cornerSize: 9,
            transparentCorners: false,
            cornerColor: 'rgb(26, 115, 232)',
            cornerStrokeColor: 'rgb(255, 255, 255)',
        });
    }

    addIgnoreRegion(params) {
        // @ts-ignore - Always sync window.mainView for E2E tests
        window.mainView = this;

        Object.assign(params, { fill: 'MediumVioletRed' });
        const r = this.addRect(params);

        // Explicitly set name property - fabric.js might not set it from constructor options
        if (params.name && !r.name) {
            r.name = params.name;
        }

        r.setControlsVisibility({
            bl: true,
            br: true,
            tl: true,
            tr: true,
            mt: true,
            mb: true,
            mtr: false,
        });

        this.canvas.add(r);
        r.bringToFront();
        // become selected
        if (params.noSelect) {
            return;
        }
        this.canvas.setActiveObject(r);
    }

    /**
     * Create ignore regions automatically from diff areas
     * @param padding - pixels to add around each diff region (default: 5)
     * @param mergeDistance - merge regions within this distance in pixels (default: 15)
     * @returns number of regions created
     */
    async createAutoIgnoreRegions(padding: number = 5, mergeDistance: number = 15): Promise<number> {
        if (!this.diffImage) {
            log.warn('[MainView] Cannot create auto regions: no diff image');
            return 0;
        }

        try {
            // Get diff groups without animation
            const { groups: rawGroups } = await highlightDiff(this, null, null, { skipAnimation: true });

            if (rawGroups.length === 0) {
                log.debug('[MainView] No diff regions found');
                return 0;
            }

            // Merge nearby groups to reduce number of small regions
            const groups = mergeNearbyGroups(rawGroups, mergeDistance);

            log.debug(`[MainView] Creating ${groups.length} auto ignore regions (merged from ${rawGroups.length} raw groups, mergeDistance: ${mergeDistance}px)`);

            // Create ignore region for each diff group
            // eslint-disable-next-line no-restricted-syntax
            for (const group of groups) {
                const regionParams = {
                    left: Math.max(0, group.minX - padding),
                    top: Math.max(0, group.minY - padding),
                    width: (group.maxX - group.minX) + padding * 2,
                    height: (group.maxY - group.minY) + padding * 2,
                    name: 'ignore_rect',
                    strokeWidth: 0,
                    noSelect: true, // Don't select each region as we add it
                };
                this.addIgnoreRegion(regionParams);
            }

            this.canvas.renderAll();
            return groups.length;
        } catch (e) {
            log.error('[MainView] Failed to create auto regions:', e);
            errorMsg({ error: 'Failed to create auto ignore regions' });
            return 0;
        }
    }

    addBoundingRegion(name) {
        const params = {
            name,
            fill: 'rgba(0,0,0,0)',
            stroke: 'green',
            strokeWidth: 3,
            top: 1,
            left: 1,
            width: this.expectedImage.getScaledWidth() - 10,
            height: this.expectedImage.getScaledHeight() - 10,
        };
        const r = this.addRect(params);
        this.canvas.add(r);
        r.bringToFront();
        this.updateBoundingOverlay();
    }

    removeAllRegions() {
        const regions = this.allRects;
        regions.forEach((region) => {
            this.canvas.remove(region);
        });
        this.updateBoundingOverlay();
    }

    get allRects() {
        return this.canvas.getObjects()
            .filter((r) => (r.name === 'ignore_rect') || (r.name === 'bound_rect'));
    }

    getLastRegion() {
        return this.canvas.item(this.canvas.getObjects().length - 1);
    }

    /**
     * 1. collect data about all rects
     * 2. convert the data to resemble.js format
     * 3. return json string
     * @deprecated Use getRegionsData() instead
     */
    getRectData() {
        const rects = this.allRects;
        const data = [];
        const coef = parseFloat(this.coef);

        rects.forEach((reg) => {
            const right = reg.left + reg.getScaledWidth();
            const bottom = reg.top + reg.getScaledHeight();
            if (coef) {
                data.push({
                    name: reg.name,
                    top: reg.top * coef,
                    left: reg.left * coef,
                    bottom: bottom * coef,
                    right: right * coef,
                });
            }
        });
        return JSON.stringify(data);
    }

    /**
     * Collect data about all regions, separated by type
     * @returns {{ ignoreRegions: string, boundRegions: string }} JSON strings for each region type
     */
    getRegionsData(): { ignoreRegions: string, boundRegions: string } {
        const rects = this.allRects;
        const ignoreRegions: any[] = [];
        const boundRegions: any[] = [];
        const coef = parseFloat(this.coef);

        rects.forEach((reg) => {
            const right = reg.left + reg.getScaledWidth();
            const bottom = reg.top + reg.getScaledHeight();
            if (coef) {
                const regionData = {
                    top: reg.top * coef,
                    left: reg.left * coef,
                    bottom: bottom * coef,
                    right: right * coef,
                };
                if (reg.name === 'ignore_rect') {
                    ignoreRegions.push(regionData);
                } else if (reg.name === 'bound_rect') {
                    boundRegions.push(regionData);
                }
            }
        });
        return {
            ignoreRegions: JSON.stringify(ignoreRegions),
            boundRegions: JSON.stringify(boundRegions),
        };
    }

    get coef() {
        return this.expectedImage.height / this.expectedImage.getScaledHeight();
    }

    /**
     * @deprecated Use sendRegions() instead
     */
    static async sendIgnoreRegions(id: string, regionsData) {
        try {
            const response = await fetch(`${config.baseUri}/v1/baselines/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ignoreRegions: regionsData }),
            });
            const text = await response.text();
            if (response.status === 200) {
                log.debug(`Successful send baseline ignored regions, id: '${id}'  resp: '${text}'`);
                successMsg({ message: 'ignored regions was saved' });
                // MainView.showToaster('ignored regions was saved');
                return;
            }
            log.error(`Cannot set baseline ignored regions , status: '${response.status}',  resp: '${text}'`);
            errorMsg({ error: 'Cannot set baseline ignored regions' });
            // MainView.showToaster('Cannot set baseline ignored regions', 'Error');
        } catch (e: unknown) {
            log.error(`Cannot set baseline ignored regions: ${errorMsg(e)}`);
            errorMsg({ error: 'Cannot set baseline ignored regions' });
            // MainView.showToaster('Cannot set baseline ignored regions', 'Error');
        }
    }

    /**
     * Send both ignore and bound regions to the server
     */
    static async sendRegions(id: string, regionsData: { ignoreRegions: string, boundRegions: string }) {
        try {
            const response = await fetch(`${config.baseUri}/v1/baselines/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    ignoreRegions: regionsData.ignoreRegions,
                    boundRegions: regionsData.boundRegions,
                }),
            });
            const text = await response.text();
            if (response.status === 200) {
                log.debug(`Successful send baseline regions, id: '${id}'  resp: '${text}'`);
                successMsg({ message: 'Regions saved' });
                return;
            }
            log.error(`Cannot set baseline regions, status: '${response.status}',  resp: '${text}'`);
            errorMsg({ error: 'Cannot set baseline regions' });
        } catch (e: unknown) {
            log.error(`Cannot set baseline regions: ${errorMsg(e)}`);
            errorMsg({ error: 'Cannot set baseline regions' });
        }
    }

    /**
     * convert json to fabric.js format
     * @param {string} regions       JSON string that contain data about regions in resemble.js format
     * @returns {object}             region data in fabric.js format
     */
    convertRegionsDataFromServer(regions) {
        const data = [];
        const coef = parseFloat(this.coef);
        regions
            .forEach((reg) => {
                const width = reg.right - reg.left;
                const height = reg.bottom - reg.top;
                if (coef) {
                    data.push({
                        name: reg.name,
                        top: reg.top / coef,
                        left: reg.left / coef,
                        width: width / coef,
                        height: height / coef,
                    });
                }
            });
        return data;
    }

    drawRegions(data) {
        // log.debug({ data });
        if (!data || data === 'undefined') {
            return;
            // log.error('The regions data is empty')
        }
        const regs = this.convertRegionsDataFromServer(JSON.parse(data));
        // log.debug('converted:', regs.length, regs);
        const classThis = this;
        regs.forEach((regParams) => {
            // eslint-disable-next-line no-param-reassign
            regParams['noSelect'] = true;
            // eslint-disable-next-line no-param-reassign
            regParams['name'] = 'ignore_rect';
            classThis.addIgnoreRegion(regParams);
        });
    }

    static async getRegionsData(baselineId: string) {
        try {
            if (!baselineId) {
                // log.debug('Cannot get regions, baseline id is empty');
                return [];
            }
            const url = `${config.baseUri}/v1/baselines?filter={"_id":"${baselineId}"}`;
            // log.debug({ url });
            const response = await fetch(url);
            const text = await response.text();
            if (response.status === 200) {
                log.debug(`Successfully got ignored regions, id: '${baselineId}'  resp: '${text}'`);
                return JSON.parse(text).results[0];
            }
            if (response.status === 202) {
                log.debug('No regions');
                return [];
            }
            log.error(`Cannot get baseline ignored regions , status: '${response.status}',  resp: '${text}'`);
            // MainView.showToaster('Cannot get baseline ignored regions', 'Error');
            errorMsg({ error: 'Cannot get baseline ignored regions' });
        } catch (e) {
            log.error(`Cannot get baseline ignored regions: ${errorMsg(e)}`);
            // MainView.showToaster('Cannot get baseline ignored regions', 'Error');
            errorMsg({ error: 'Cannot get baseline ignored regions' });
        }
        return null;
    }

    async getSnapshotIgnoreRegionsDataAndDrawRegions(id: string) {
        this.removeAllRegions();
        const regionData = await MainView.getRegionsData(id);
        this.drawRegions(regionData.ignoreRegions);
        this.drawBoundRegions(regionData.boundRegions);
    }

    /**
     * Draw bound regions on the canvas
     * @param data JSON string with bound region data
     */
    drawBoundRegions(data: string) {
        if (!data || data === 'undefined' || data === '[]') {
            return;
        }
        const regs = this.convertRegionsDataFromServer(JSON.parse(data));
        regs.forEach((regParams) => {
            const params = {
                name: 'bound_rect',
                fill: 'rgba(0,0,0,0)',
                stroke: 'green',
                strokeWidth: 3,
                top: regParams.top,
                left: regParams.left,
                width: regParams.width,
                height: regParams.height,
            };
            const r = this.addRect(params);
            this.canvas.add(r);
            r.bringToFront();
        });
        this.updateBoundingOverlay();
    }

    // ==================== RCA (Root Cause Analysis) Methods ====================

    /**
     * Set callbacks for RCA overlay events
     */
    setRCACallbacks(callbacks: RCAOverlayCallbacks): void {
        this.rcaCallbacks = callbacks;
        // Recreate overlay with new callbacks
        if (this.rcaOverlay) {
            const wasEnabled = this.rcaOverlay.isEnabled();
            this.rcaOverlay.disable();
            this.rcaOverlay = new RCAOverlay(this.canvas, callbacks);
            if (wasEnabled) {
                log.debug('[MainView] RCA callbacks updated, overlay was enabled - need to re-enable');
            }
        }
    }

    /**
     * Enable RCA overlay with DOM data and changes
     */
    enableRCAOverlay(
        actualDom: DOMNode | null,
        baselineDom: DOMNode | null,
        changes: DOMChange[]
    ): void {
        if (!this.rcaOverlay) {
            log.warn('[MainView] RCA overlay not initialized');
            return;
        }

        // Get the actual image position and scale on canvas
        const image = this.actualImage || this.expectedImage;
        const imageLeft = image?.left || 0;
        const imageTop = image?.top || 0;
        const imageScaleX = image?.scaleX || 1;
        const imageScaleY = image?.scaleY || 1;

        // Use image scale (not canvas zoom) for coordinate transform
        // DOM coordinates are relative to original image size
        const scale = imageScaleX; // Assuming uniform scale

        log.debug('[MainView] Enabling RCA overlay', {
            hasActualDom: !!actualDom,
            hasBaselineDom: !!baselineDom,
            changesCount: changes.length,
            scale,
            offsetX: imageLeft,
            offsetY: imageTop,
            imageScaleX,
            imageScaleY,
        });

        this.rcaOverlay.enable(actualDom, baselineDom, changes, scale, imageLeft, imageTop);
    }

    /**
     * Disable RCA overlay
     */
    disableRCAOverlay(): void {
        if (this.rcaOverlay) {
            log.debug('[MainView] Disabling RCA overlay');
            this.rcaOverlay.disable();
        }
    }

    /**
     * Update RCA overlay transform when zoom/pan changes
     */
    private updateRCATransform(): void {
        if (this.rcaOverlay?.isEnabled()) {
            // Get the actual image position and scale on canvas
            const image = this.actualImage || this.expectedImage;
            const imageLeft = image?.left || 0;
            const imageTop = image?.top || 0;
            const imageScaleX = image?.scaleX || 1;

            this.rcaOverlay.updateImageTransform(imageScaleX, imageLeft, imageTop);
        }
    }

    /**
     * Highlight a specific DOM change on the canvas
     */
    highlightRCAChange(change: DOMChange | null): void {
        if (this.rcaOverlay?.isEnabled()) {
            this.rcaOverlay.highlightChange(change);
        }
    }

    /**
     * Highlight a specific DOM node on the canvas
     */
    highlightRCANode(node: DOMNode | null): void {
        if (this.rcaOverlay?.isEnabled()) {
            this.rcaOverlay.highlightNode(node);
        }
    }

    /**
     * Check if RCA overlay is currently enabled
     */
    isRCAEnabled(): boolean {
        return this.rcaOverlay?.isEnabled() ?? false;
    }

}
