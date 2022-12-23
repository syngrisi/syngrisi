import { fabric } from 'fabric';
import { SimpleView } from './simpleView';
import { SideToSideView } from './sideToSideView';
import { lockImage } from './helpers';
import { errorMsg, successMsg } from '../../../../../../shared/utils/utils';
import config from '../../../../../../config';

/* eslint-disable dot-notation,no-underscore-dangle */

interface Props {
    canvasElementWidth: number
    canvasElementHeight: number
    canvasId: string
    // url: string
    actual: any
    expectedImage: any
    actualImage: any
    diffImage: any
}

export class MainView {
    canvasElementWidth: number;

    canvasElementHeight: number;

    sliderView: SideToSideView;

    canvas: fabric.Canvas;

    actualImage: any;

    currentMode: any;

    defaultMode: string;

    // currentView: string;

    actualView: SimpleView;

    expectedView: SimpleView;

    diffView: SimpleView;

    expectedImage: any;

    diffImage: any;

    // _currentView: string;
    //
    // public get currentView() {
    //     return this._currentView;
    // }
    //
    // public set currentView(value: string) {
    //     this._currentView = value;
    // }

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

        if (actual) {
            this.sliderView = new SideToSideView(
                {
                    mainView: this,
                },
            );
        }

        // events
        this.selectionEvents();
        // this.zoomEvents();
        this.panEvents();

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

    panEvents() {
        this.canvas.on(
            'mouse:move', (e) => {
                // console.log(e.e.buttons);
                if ((e.e.buttons === 4)) {
                    this.canvas.setCursor('grab');

                    const mEvent = e.e;
                    const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
                    this.canvas.relativePan(delta);
                    this.canvas.renderAll();
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

    get objects() {
        return this.canvas.getObjects();
    }

    async destroyAllViews() {
        this.expectedView.destroy();
        this.actualView.destroy();
        this.diffView.destroy();
        await this.sliderView.destroy();
    }

    async switchView(view: string) {
        // this.currentView = view;
        await this.destroyAllViews();
        this.sliderView = new SideToSideView(
            {
                mainView: this,
            },
        );
        this[`${view}View`].render();
    }

    static snapshotUrl(filename) {
        return `/snapshoots/${filename}`;
    }

    static lockImage(image) {
        image.set({
            lockScalingX: true,
            lockScalingY: true,
            lockMovementX: true,
            lockMovementY: true,
            hoverCursor: 'default',
            hasControls: false,
            selectable: false,
        });
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
        this.canvas.renderAll();
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

    addRect(params) {
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
        Object.assign(params, { fill: 'MediumVioletRed' });
        const r = this.addRect(params);
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
    }

    getLastRegion() {
        return this.canvas.item(this.canvas.getObjects().length - 1);
    }

    /**
     * 1. collect data about all rects
     * 2. convert the data to resemble.js format
     * 3. return json string
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

    get coef() {
        return this.expectedImage.height / this.expectedImage.getScaledHeight();
    }

    static async sendIgnoreRegions(id: string, regionsData) {
        try {
            const response = await fetch(`${config.baseUri}/baselines/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ignoreRegions: regionsData }),
            });
            const text = await response.text();
            if (response.status === 200) {
                console.log(`Successful send baseline ignored regions, id: '${id}'  resp: '${text}'`);
                successMsg({ message: 'ignored regions was saved' });
                // MainView.showToaster('ignored regions was saved');
                return;
            }
            console.error(`Cannot set baseline ignored regions , status: '${response.status}',  resp: '${text}'`);
            errorMsg({ error: 'Cannot set baseline ignored regions' });
            // MainView.showToaster('Cannot set baseline ignored regions', 'Error');
        } catch (e) {
            console.error(`Cannot set baseline ignored regions: ${e.stack || e}`);
            errorMsg({ error: 'Cannot set baseline ignored regions' });
            // MainView.showToaster('Cannot set baseline ignored regions', 'Error');
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

    get allRects() {
        return this.canvas.getObjects()
            .filter((r) => (r.name === 'ignore_rect') || (r.name === 'bound_rect'));
    }

    drawRegions(data) {
        // console.log({ data });
        if (!data || data === 'undefined') {
            return;
            // console.error('The regions data is empty')
        }
        const regs = this.convertRegionsDataFromServer(JSON.parse(data));
        // console.log('converted:', regs.length, regs);
        const classThis = this;
        regs.forEach((regParams) => {
            // eslint-disable-next-line no-param-reassign
            regParams['noSelect'] = true;
            classThis.addIgnoreRegion(regParams);
        });
    }

    static async getRegionsData(baselineId: string) {
        try {
            if (!baselineId) {
                // console.log('Cannot get regions, baseline id is empty');
                return [];
            }
            const url = `${config.baseUri}/baselines/${baselineId}`;
            // console.log({ url });
            const response = await fetch(url);
            const text = await response.text();
            if (response.status === 200) {
                console.log(`Successfully got ignored regions, id: '${baselineId}'  resp: '${text}'`);
                return JSON.parse(text);
            }
            if (response.status === 202) {
                console.log('No regions');
                return [];
            }
            console.error(`Cannot get baseline ignored regions , status: '${response.status}',  resp: '${text}'`);
            // MainView.showToaster('Cannot get baseline ignored regions', 'Error');
            errorMsg({ error: 'Cannot get baseline ignored regions' });
        } catch (e) {
            console.error(`Cannot get baseline ignored regions: ${e.stack || e}`);
            // MainView.showToaster('Cannot get baseline ignored regions', 'Error');
            errorMsg({ error: 'Cannot get baseline ignored regions' });
        }
        return null;
    }

    async getSnapshotIgnoreRegionsDataAndDrawRegions(id: string) {
        const regionData = await MainView.getRegionsData(id);
        this.drawRegions(regionData.ignoreRegions);
    }
}
