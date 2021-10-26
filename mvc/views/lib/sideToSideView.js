/* eslint-disable no-underscore-dangle */
/* global fabric */

// eslint-disable-next-line no-unused-vars
class SideToSideView {
    constructor(canvas, uriBaseline, uriActual) {
        this.canvas = canvas;
        this.uriBaseline = uriBaseline;
        this.uriActual = uriActual;
    }

    static imageFromUrl(url) {
        return new Promise(
            (resolve, reject) => {
                try {
                    fabric.Image.fromURL(
                        url, (img) => resolve(img)
                    );
                } catch (e) {
                    console.error(`cannot create image from url, error: '${e}'`);
                    reject(e);
                }
            }
        );
    }

    lockCommon(object) {
        object.set({
            lockMovementY: true,
            lockMovementX: true,
            selectable: false,
            hasControls: false,
        });
    }

    diffEvents() {
        const $this = this;

        this.canvas.on('object:moved', () => {
            $this.baselineLabel.opacity = 0;
            $this.actualLabel.opacity = 0;
            $this.inMovement = false;
        });

        this.canvas.on('object:moving', (evt) => {
            $this.inMovement = true;
            if (evt.target.name === 'divider') {
                // console.log($this.canvas.getZoom());
                this.baselineLabel.opacity = 1;
                this.actualLabel.opacity = 1;
                $this.rectClip.set({
                    left: evt.target.left + evt.target.width / 2,
                });

                $this.baselineLabel.set({
                    left: evt.target.left - $this.canvas.getWidth() / 10,
                });

                $this.actualLabel.set({
                    left: evt.target.left + $this.canvas.getWidth() / 10,
                });
                $this.canvas.renderAll();
            }
        });
    }

    async destroy() {
        [this.actualImg, this.baselineImg, this.divider, this.actualLabel, this.baselineLabel].forEach((item) => {
            this.canvas.remove(item);
        });
        delete this.canvas.backgroundImage;
    }

    async render() {
        // IMAGES
        this.baselineImg = await SideToSideView.imageFromUrl(this.uriBaseline);
        this.baselineImg.evented = false;
        this.lockCommon(this.baselineImg);

        this.actualImg = await SideToSideView.imageFromUrl(this.uriActual);
        this.actualImg.evented = false;
        this.lockCommon(this.actualImg);
        // this.canvas.backgroundImage = this.actualImg;

        // DIVIDER
        const dividerFillColor = '#E5E5E5';
        const dividerStrokeColor = 'gray';
        const dividerLine = new fabric.Rect({
            left: this.canvas.getWidth() / 2,
            top: -2,
            hoverCursor: 'col-resize',
            moveCursor: 'col-resize',
            lockMovementY: true,
            hasControls: false,
            strokeWidth: 1,
            stroke: dividerStrokeColor,
            fill: dividerFillColor,
            strokeUniform: true,
            width: 4,
            height: this.canvas.getHeight() + 4,
        });

        const slider = new fabric.Rect({
            left: this.canvas.getWidth() / 2 - 6,
            originY: 'top',
            top: (this.canvas.getHeight()) / 2 - 20,
            hoverCursor: 'col-resize',
            moveCursor: 'col-resize',

            strokeWidth: 1,
            stroke: dividerStrokeColor,
            fill: dividerFillColor,
            strokeDashOffset: 0,
            strokeDashArray: [6, 4, 6, 0, 40, 0, 6, 4, 6, 0, 40],
            strokeUniform: true,
            width: 16,
            height: 40,
            // opacity: 0.85,
            // shadow,
        });

        const arrowLeft = new fabric.Triangle({
            left: this.canvas.getWidth() / 2 - 38,
            originY: 'top',
            top: (this.canvas.getHeight()) / 2 + 8,
            hoverCursor: 'col-resize',
            moveCursor: 'col-resize',
            angle: -90,
            stroke: dividerStrokeColor,
            fill: dividerFillColor,
            strokeUniform: true,
            width: 16,
            height: 16,
        });

        const arrowRight = new fabric.Triangle({
            left: this.canvas.getWidth() / 2 + 43,
            originY: 'top',
            top: (this.canvas.getHeight()) / 2 - 8,
            hoverCursor: 'col-resize',
            moveCursor: 'col-resize',
            angle: 90,
            stroke: dividerStrokeColor,
            fill: dividerFillColor,
            strokeUniform: true,
            width: 16,
            height: 16,
        });

        this.divider = new fabric.Group([arrowLeft, arrowRight, dividerLine, slider]);
        this.divider.set({
            name: 'divider',
            hoverCursor: 'col-resize',
            moveCursor: 'col-resize',
            borderColor: 'transparent',
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockMovementY: true,
            opacity: 1,
            // shadow,
        });

        // LABELS
        const baselineFrame = new fabric.Rect({
            left: 0,
            top: 0,
            originX: 'center',
            originY: 'center',
            hoverCursor: 'default',
            rx: 5,
            ry: 5,
            fill: '#06ba0e',
            // stroke: 'white',
            width: 80,
            height: 30,
            opacity: 0.85,
            stroke: 'gray',
        });
        this.lockCommon(baselineFrame);
        const baselineText = new fabric.Text('baseline', {
            textAlign: 'left',
            originX: 'center',
            originY: 'center',
            hoverCursor: 'default',
            fill: 'white',
            fontSize: 20,
            lockMovementY: true,
            lockMovementX: true,
            lockScalingX: true,
            lockScalingY: true,
        });

        this.baselineLabel = new fabric.Group([baselineFrame, baselineText]);

        const actualFrame = new fabric.Rect({
            left: 0,
            top: 0,
            fill: '#fb4d45',
            // stroke: 'white',
            originX: 'center',
            originY: 'center',
            hoverCursor: 'default',
            rx: 5,
            ry: 5,
            width: 70,
            height: 30,
            opacity: 0.85,
            stroke: 'gray',
        });
        this.lockCommon(actualFrame);
        const actualText = new fabric.Text('actual', {
            fontSize: 20,
            width: 70,
            fill: 'white',
            originX: 'center',
            originY: 'center',
            hoverCursor: 'default',
            textAlign: 'right',
            lockMovementY: true,
            lockMovementX: true,
            lockScalingX: true,
            lockScalingY: true,
        });
        this.actualLabel = new fabric.Group([actualFrame, actualText]);

        // CLIP
        this.rectClip = new fabric.Rect({
            left: this.canvas.getWidth() / 2,
            top: 0,
            originX: 'left',
            absolutePositioned: true,
            lockMovementY: true,
            fill: 'green',
            width: 70,
            height: 70,
        });
        this.actualImg.clipPath = this.rectClip;

        // LOCATION AND SIZE
        this.divider.left = this.canvas.getWidth() / 2 - this.divider.width / 2;
        this.baselineLabel.top = this.canvas.getHeight() / 2 - 15;
        this.baselineLabel.left = (this.divider.left) - this.canvas.getWidth() / 10;

        this.actualLabel.top = this.canvas.getHeight() / 2 - 15;
        this.actualLabel.left = this.divider.left + this.canvas.getWidth() / 10;

        // this.rectClip.width = this.canvas.getWidth();
        this.rectClip.width = 10000;
        this.rectClip.height = this.canvas.getHeight();

        // SCALING
        this.baselineImg.scaleToWidth(this.canvas.width);
        const ratio = (this.canvas.width / this.baselineImg._element.width);
        this.actualImg.scaleToWidth(this.actualImg._element.width * ratio);

        // RENDER
        this.canvas.add(this.baselineImg);
        this.canvas.add(this.actualImg);
        this.canvas.add(this.actualLabel);
        this.canvas.add(this.baselineLabel);
        this.canvas.add(this.divider);

        this.canvas.renderAll();

        this.diffEvents();
    }
}
