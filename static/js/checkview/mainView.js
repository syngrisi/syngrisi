/* eslint-disable dot-notation,no-underscore-dangle */
/* global XMLHttpRequest fabric $ window */

// eslint-disable-next-line no-unused-vars
class MainView {
    constructor(params) {
        // init properties
        this.canvasElementWidth = params.canvasElementWidth;
        this.canvasElementHeight = params.canvasElementHeight;
        this.canvas = new fabric.Canvas(params.canvasId, {
            width: this.canvasElementWidth,
            height: this.canvasElementHeight,
            preserveObjectStacking: true,
            uniformScaling: false,
        });

        this.expectedCanvasViewportAreaSize = MainView.calculateExpectedCanvasViewportAreaSize();

        this.defaultMode = '';
        this.currentMode = {
            mode: '',
            set(value) {
                this.mode = value;
            },
            toggle(mode) {
                if (this.mode === mode) {
                    return this.set(this.defaultMode);
                }
                return this.set(mode);
            },
            isPan() {
                return this.mode === 'pan';
            },
        };

        this.baselineUrl = params.url;
        if (params.actual) {
            this.sideToSideView = new SideToSideView(this.canvas, this.baselineUrl, MainView.snapshotUrl(params.actual.filename));
        }

        this.selectionEvents();
        this.zoomEvents();
        this.panEvents();
        // render view
        this.renderBaselineView();
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
        const canvasDimensions = document.getElementById('snapshoot')
            .getBoundingClientRect();
        return {
            width: viewportWidth - canvasDimensions.x,
            height: viewportHeight - canvasDimensions.y,
        };
    }

    panEvents() {
        this.canvas.on(
            'mouse:move', (e) => {
                const s2sMoving = this.sideToSideView.inMovement;
                if (this.mouseDown && this.currentMode.isPan() && !s2sMoving) {
                    this.canvas.setCursor('grab');

                    const mEvent = e.e;
                    const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
                    this.canvas.relativePan(delta);
                    this.canvas.renderAll();
                }
            }
        );

        this.canvas.on(
            'mouse:down', () => {
                this.mouseDown = true;

                if (this.currentMode.isPan()) {
                    this.canvas.setCursor('grab');
                    this.canvas.selection = false;
                    this.canvas.renderAll();
                }
            }
        );
        this.canvas.on(
            'mouse:up', () => {
                this.mouseDown = false;
                this.canvas.setCursor('default');
                this.canvas.renderAll();
                this.canvas.selection = true;
            }
        );

        this.canvas.on('mouse:wheel', (opt) => {
            if (opt.e.ctrlKey) return;
            const delta = new fabric.Point(-opt.e.deltaX / 2, -opt.e.deltaY / 2);
            this.canvas.relativePan(delta);
            this.canvas.renderAll();
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
    }

    selectionEvents() {
        // disable rotation point for selections
        this.canvas.on('selection:created', (e) => {
            const activeSelection = e.target;
            if (!activeSelection?._objects?.length || (activeSelection?._objects?.length < 2)) return;
            activeSelection.hasControls = false;
            this.canvas.renderAll();
        });

        // fired e.g. when you select one object first,
        // then add another via shift+click
        this.canvas.on('selection:updated', (e) => {
            const activeSelection = e.target;
            if (!activeSelection?._objects?.length || (activeSelection?._objects?.length < 2)) return;
            if (activeSelection.hasControls) {
                activeSelection.hasControls = false;
            }
        });
    }

    zoomEvents() {
        this.canvas.on('mouse:wheel', (opt) => {
            if (!opt.e.ctrlKey) return;
            const delta = opt.e.deltaY;
            let zoom = this.canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            // console.log({zoom: zoom * 100});
            this.canvas.zoomToPoint({
                x: opt.e.offsetX,
                y: opt.e.offsetY,
            }, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });
    }

    get objects() {
        return this.canvas.getObjects();
    }

    pressedButton(id) {
        const button = document.getElementById(id);
        if (!button.classList.contains('pressed-toolbar-button')) {
            button.classList.add('pressed-toolbar-button');
        }
    }

    unpressedButton(id) {
        const button = document.getElementById(id);
        if (button && button.classList.contains('pressed-toolbar-button')) {
            button.classList.remove('pressed-toolbar-button');
        }
    }

    // DESTROY VIEWS
    destroyActualView() {
        this.canvas.remove(this.actualImage);
        const button = document.getElementById('toggle-actual-baseline');
        button.innerText = 'B';
        button.title = 'switch to actual snapshot (current is baseline)';
    }

    destroyBaselineView() {
        this.canvas.remove(this.image);
    }

    destroyDiffView() {
        this.canvas.remove(this.diffImage);
        this.unpressedButton('diff-wrapper');
    }

    destroySideToSideView() {
        this.sideToSideView.destroy();
        this.unpressedButton('side-wrapper');
    }

    destroyAllViews() {
        this.destroyBaselineView();
        this.destroyActualView();
        this.destroyDiffView();
        this.destroySideToSideView();
        this.currentView = 'none';
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

    calculateImageWidth(image) {
        let { width } = image;
        const isHigh = () => (image.height > this.expectedCanvasViewportAreaSize.height)
            && ((image.height / this.expectedCanvasViewportAreaSize.height) < 10);

        if (isHigh()) {
            width = image.width * (this.expectedCanvasViewportAreaSize.height / image.height);
        }
        const isExtraSmall = () => image.height < 50;
        if (isExtraSmall()) width *= 2;

        if (width > this.canvas.width) {
            width = this.canvas.width;
        }
        return width;
    }

    async initResize(image) {
        image.scaleToWidth(this.calculateImageWidth(image) * this.canvas.getZoom());
    }

    // RENDER VIEWS
    async renderBaselineView() {
        this.currentView = 'BaselineView';
        this.image = await this.imageFromUrl(this.baselineUrl);
        MainView.lockImage(this.image);

        this.canvas.add(this.image);

        this.image.sendToBack();
        this.initResize(this.image);
        this.canvas.renderAll();
    }

    async renderActualView(url) {
        this.currentView = 'ActualView';
        this.actualImage = await this.imageFromUrl(url);
        MainView.lockImage(this.actualImage);

        // const ratio = this.canvasElementWidth / this.actualImage.width;
        this.canvas.add(this.actualImage);

        this.actualImage.sendToBack();
        this.initResize(this.actualImage);
        const button = document.getElementById('toggle-actual-baseline');
        button.innerText = 'A';
        button.title = 'switch to baseline snapshot (current is actual)';
    }

    async renderDiffView(url) {
        this.currentView = 'DiffView';
        this.diffImage = await this.imageFromUrl(url);
        MainView.lockImage(this.diffImage);

        this.canvas.add(this.diffImage);
        this.diffImage.sendToBack();
        this.initResize(this.diffImage);
        this.pressedButton('diff-wrapper');
    }

    async renderSideToSideView() {
        this.currentView = 'SideToSideView';

        await this.sideToSideView.render(this.initResize);
        this.initResize(this.sideToSideView.actualImg);
        this.initResize(this.sideToSideView.baselineImg);
        this.sideToSideView.divider.left = this.sideToSideView.baselineImg.getScaledWidth() / 2 - this.sideToSideView.divider.width / 2;
        this.sideToSideView.baselineLabel.top = this.sideToSideView.canvas.getHeight() / 2 - 15;
        this.sideToSideView.baselineLabel.left = (this.sideToSideView.divider.left) - this.sideToSideView.canvas.getWidth() / 10;

        this.sideToSideView.actualLabel.top = this.sideToSideView.canvas.getHeight() / 2 - 15;
        this.sideToSideView.actualLabel.left = this.sideToSideView.divider.left + this.sideToSideView.canvas.getWidth() / 10;

        this.canvas.requestRenderAll();
        await this.pressedButton('side-wrapper');
    }

    toggleSideToSideView() {
        if (this.currentView === 'SideToSideView') {
            this.destroyAllViews();
            this.renderBaselineView();
            return;
        }
        this.destroyAllViews();
        this.renderSideToSideView();
    }

    toggleActual(params) {
        if (this.currentView === 'ActualView') {
            this.destroyAllViews();
            this.renderBaselineView();
            return;
        }
        this.destroyAllViews();
        const uri = `/snapshoots/${params.filename}`;
        this.renderActualView(uri);
    }

    toggleDiff(params) {
        if (this.currentView === 'DiffView') {
            this.destroyAllViews();
            this.renderBaselineView();
            return;
        }
        this.destroyAllViews();
        const uri = `/snapshoots/${params.filename}`;
        this.renderDiffView(uri);
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
        const top = (lastTop > document.documentElement.scrollTop && lastTop < document.documentElement.scrollTop + window.innerHeight)
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
            // hasBorders: true,
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
            width: this.image.getScaledWidth() - 10,
            height: this.image.getScaledHeight() - 10,
        };
        const r = this.addRect(params);
        this.canvas.add(r);
        r.bringToFront();
    }

    getLastRegion() {
        return this.canvas.item(this.canvas.getObjects().length - 1);
    }

    zoom(ratio) {
        // console.log({ currentZoom: this.canvas.getZoom() });
        let newRatio = Math.round(this.canvas.getZoom() * 100) + ratio;
        newRatio = newRatio < 2 ? 2 : newRatio;
        newRatio = newRatio > 1000 ? 1000 : newRatio;
        this.canvas.zoomToPoint(new fabric.Point(this.canvas.width / 2,
            30), newRatio / 100);
        this.canvas.renderAll();
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
        return this.image.height / this.image.getScaledHeight();
    }

    showNotification(msg, status = 'Success') {
        document.getElementById('notify-header').textContent = status;
        document.getElementById('notify-message').textContent = msg;
        document.getElementById('notify-rect')
            .setAttribute('fill', '#2ECC40');
        if (status === 'Error') {
            document.getElementById('notify-rect')
                .setAttribute('fill', '#FF4136');
        }
        $('#notify')
            .show();
        setTimeout(
            () => $('#notify')
                .hide(),
            4000
        );
    }

    sendIgnoreRegions(id, regionsData) {
        const xhr = new XMLHttpRequest();
        const params = `id=${id}&ignoreRegions=${JSON.stringify(regionsData)}`;
        xhr.open('PUT', `/snapshots/${id}`, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        const classThis = this;
        // NEED TO ADD UPDATE BASELINE LOGIC TO .onload EVENT!!!
        xhr.onload = function regNotification() {
            if (xhr.status === 200) {
                console.log(`Successful send regions data, id: '${id}'  resp: '${xhr.responseText}'`);
                classThis.showNotification('Regions were saved');
            } else {
                console.error(`Cannot send regions data, status: '${xhr.status}',  resp: '${xhr.responseText}'`);
                classThis.showNotification('Cannot save regions', 'Error');
            }
        };
        xhr.send(params);
    }

    /**
     * convert json to fabric.js format
     * @param {string} regions       JSON string that contain data about regions in resemble.js format
     * @returns {object}             region data in fabric.js format
     */
    convertRegionsDataFromServer(regions) {
        const data = [];
        const coef = parseFloat(this.coef);
        JSON.parse(regions)
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
            regParams['noSelect'] = true;
            classThis.addIgnoreRegion(regParams);
        });
    }

    getRegionsData(snapshootId) {
        return new Promise((resolve, reject) => {
            // console.log(`get snapshoot data id: ${snapshootId}`);
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `/snapshot/${snapshootId}/`, true);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    return resolve(JSON.parse(xhr.responseText));
                }
                console.error(`Cannot get regions data, status: '${xhr.status}',  resp: '${xhr.responseText}'`);
                return reject(xhr);
            };
            xhr.send('');
        });
    }

    async getSnapshotIgnoreRegionsDataAndDrawRegions(id) {
        const regionData = await this.getRegionsData(id);
        this.drawRegions(regionData.ignoreRegions);
    }

    imageFromUrl(url) {
        return new Promise(
            (resolve, reject) => {
                try {
                    return fabric.Image.fromURL(url,
                        (img) => resolve(img));
                } catch (e) {
                    console.error(`cannot create image from url, error: '${e}'`);
                    return reject(new Error(`cannot create image from url, error: '${e}'`));
                }
            }
        );
    }
}
