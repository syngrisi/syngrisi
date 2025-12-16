/* eslint-disable no-underscore-dangle */
import { fabric } from 'fabric';

// patching fabric Object transformation
// @ts-ignore
// fabric.Object.prototype.ignoreZoom = false;
// fabric.Object.prototype.transform = function (ctx) {
//
//     const needFullTransform = (this.group && !this.group._transformDone)
//         || (this.group && this.canvas && ctx === this.canvas.contextTop);
//     const m = this.calcTransformMatrix(!needFullTransform);
//     ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
//     // // ignore zoom start
//     // if (this.ignoreZoom && !this.group && this.canvas) {
//     //     console.log('111')
//     //     const zoom = 1 / this.canvas.getZoom();
//     //     ctx.scale(zoom, zoom);
//     // }
//     // // ignore zoom end
// };

export class SideToSideView {
    private mainView: any;

    canvas: any;

    private dividerLine: any;

    private dividerSlider: any;

    constructor({ mainView }: any) {
        this.mainView = mainView;
        this.canvas = mainView.canvas;

        // event handlers, here - because need arrow function to overstate this and bind problem
        this.zoomEventHandler = () => {
            this.dividerLine.scaleX = (1 / this.canvas.getZoom());
            this.dividerSlider.scaleX = (1 / this.canvas.getZoom());
            this.dividerSlider.scaleY = (1 / this.canvas.getZoom());
        };

        this.canvasMouseCLickHandler = (e) => {
            const $this = this;
            $this.folowMouse = !$this.folowMouse;
            $this.followCursor(e);
            $this.divider.set({
                hoverCursor: $this.folowMouse ? 'grab' : 'pointer',
            });
            if ($this.folowMouse) {
                $this.removeLabels();
            } else {
                $this.renderLabels();
            }
        };

        this.canvasMouseMoveHandler = (e) => {
            const $this = this;
            if (!$this.folowMouse) return;
            $this.followCursor(e);
        };

        this.canvasPanHandler = (e) => {
            const $this = this;
            if (!$this.folowMouse) return;
            $this.followCursor(e);
        };
    }

    static lockCommon(object) {
        object.set({
            lockMovementY: true,
            lockMovementX: true,
            selectable: false,
            hasControls: false,
        });
    }

    addZoomEvents() {
        document.addEventListener('zoom', this.zoomEventHandler, false);
    }

    removeZoomEvents() {
        document.removeEventListener('zoom', this.zoomEventHandler, false);
    }

    followCursor(e: any) {
        const newLeft = (
            ((e.e.clientX - (this.canvasLeft + this.canvasOffsetX()))
                / this.canvas.getZoom())
        );

        const newTop = (
            e.e.clientY / this.canvas.getZoom()
            - this.canvasOffsetY() / this.canvas.getZoom()
            - this.canvasTop / this.canvas.getZoom()
            - this.dividerSlider.width / 2
            // + (48 / this.canvas.getZoom())
        );

        // moving the object along with mouse cursor
        this.divider.left = newLeft - (this.divider.width) / 2 + (this.dividerSlider.width / 2);
        // (this.expectedRectClip.width * -1) + this.actualImg.getScaledWidth() / 2;
        this.actualRectClip.left = newLeft;
        this.expectedRectClip.left = newLeft - this.expectedRectClip.width;
        this.divider.top = newTop - (this.dividerSlider.height / this.canvas.getZoom()) / 2;
        this.divider.setCoords();
        this.canvas.renderAll();
    }

    addDividerFollowMouseEvents() {
        this.canvas.on(
            {
                'mouse:down': this.canvasMouseCLickHandler,
                'mouse:move': this.canvasMouseMoveHandler,
                pan: this.canvasPanHandler,
            },
        );
    }

    removeDividerFollowMouseEvents() {
        this.canvas.off('mouse:down', this.canvasMouseCLickHandler);
        this.canvas.off('mouse:move', this.canvasMouseMoveHandler);
        this.canvas.off('pan', this.canvasPanHandler);
    }

    canvasOffsetX() {
        return this.canvas.viewportTransform[4];
    }

    canvasOffsetY() {
        return this.canvas.viewportTransform[5];
    }

    divider() {
        const $this = this;
        const dividerFillColor = '#FFFFFF';
        const dividerStrokeColor = '#878a8c';
        this.dividerOffset = 500000;
        this.dividerLine = new fabric.Rect({
            originX: 'center',
            originY: 'top',
            left: this.canvas.getWidth() / 2,
            top: 0,
            lockMovementY: true,
            lockMovementX: true,
            hasControls: false,
            hasBorders: false,
            stroke: dividerStrokeColor,
            fill: dividerFillColor,
            strokeWidth: 1,
            strokeUniform: false,
            width: 3,
            height: this.canvas.getHeight() + this.dividerOffset,
        });

        this.dividerSliderCircle = new fabric.Circle({
            originX: 'center',
            originY: 'top',
            moveCursor: 'none',
            hasControls: false,
            hasBorders: false,
            left: (this.canvas.getWidth() / 2),
            // top: 200,
            top: (this.canvas.getHeight() / 2) + this.dividerOffset / 2 + 24,
            radius: 24,
            fill: 'white',
            stroke: dividerStrokeColor,
            strokeUniform: false,
            strokeWidth: 1,
        });

        this.dividerSliderText = new fabric.Text('❮   ❯', {
            top: (this.canvas.getHeight() / 2) + this.dividerOffset / 2 + 48,
            left: (this.canvas.getWidth() / 2),
            textAlign: 'left',
            originX: 'center',
            originY: 'center',
            hoverCursor: 'default',
            fill: dividerStrokeColor,
            fontSize: 17,
            lockMovementY: true,
            lockMovementX: true,
            lockScalingX: true,
            lockScalingY: true,
        });

        this.dividerSlider = new fabric.Group(
            [
                this.dividerSliderCircle,
                this.dividerSliderText,
            ],
        );

        this.dividerSlider.set(
            {
                top: (this.canvas.getHeight() / 2) + this.dividerOffset / 2 + 48,
                left: (this.canvas.getWidth() / 2),
                textAlign: 'left',
                originX: 'center',
                originY: 'center',
                hoverCursor: 'default',
                fill: dividerStrokeColor,
                fontSize: 17,
                lockMovementY: true,
                lockMovementX: true,
                lockScalingX: true,
                lockScalingY: true,
            },
        );

        const divider = new fabric.Group(
            [
                this.dividerLine,
                this.dividerSlider,
            ],
        );
        divider.set({
            originX: 'center',
            originY: 'center',
            top: ((this.canvas.getHeight() / 2) / this.canvas.getZoom()) - this.canvasOffsetY() - 48,
            name: 'divider',
            hoverCursor: $this.folowMouse ? 'grab' : 'pointer',
            borderColor: 'transparent',
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockMovementY: true,
            lockMovementX: true,
            opacity: 1,
        });
        return divider;
    }

    actualRectClip() {
        return new fabric.Rect({
            top: this.actualImg.height * -1,
            originX: 'left',
            originY: 'top',
            absolutePositioned: true,
            lockMovementY: true,
            lockMovementX: true,
            objectCaching: false,
            // opacity: 0.00001,
            // width: 70,
            height: this.actualImg.height * 3,
        });
    }

    expectedRectClip() {
        return new fabric.Rect({
            top: this.expectedImg.height * -1,
            // opacity: 0.00001,
            originX: 'left',
            originY: 'top',
            absolutePositioned: true,
            lockMovementY: true,
            lockMovementX: true,
            objectCaching: false,
            // width: 70,
            height: this.expectedImg.height * 3,
        });
    }

    renderLabels() {
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 0.8;
            }
          }
        `;
        document.head.appendChild(style);

        const renderCanvasLabel = (label: string) => {
            const canvasEl = document.getElementById('snapshoot')!;
            const labelEl = document.createElement('div');
            labelEl.id = `label_${label}`;
            labelEl.style.position = 'absolute';
            labelEl.style.fontSize = '28px';
            labelEl.style.zIndex = '100000';
            labelEl.style.padding = '15px';
            labelEl.style.textAlign = 'center';
            // labelEl.style.animation = 'fadeIn 0.5s ease-in-out forwards';
            // labelEl.style.transition = 'opacity 0.5s ease-out';
            labelEl.style.transition = '';
            labelEl.style.opacity = '0.8';
            labelEl.style.top = `${canvasEl.clientHeight / 2 - 34}px`;
            labelEl.style.left = `${
                (label === 'expected'
                    ? canvasEl.clientWidth / 4
                    : (canvasEl.clientWidth / 4) * 3 - 50)
            }px`;
            labelEl.style.backgroundColor = '#373A40';
            labelEl.style.color = 'white';
            labelEl.innerText = label;

            canvasEl.append(labelEl);
        };
        renderCanvasLabel('expected');
        renderCanvasLabel('actual');
    }

    removeLabels() {
        const removeLabel = (label: string) => {
            const labelEl = document.getElementById(`label_${label}`)!;
            if (!labelEl) return;
            // labelEl.style.animation = '';
            labelEl.style.transition = 'opacity 0.5s ease-out';
            labelEl.style.opacity = '0';
            setTimeout(() => labelEl.remove(), 700);
        };
        removeLabel('expected');
        removeLabel('actual');
    }

    async render() {
        // IMAGES
        this.expectedImg = this.mainView.expectedImage;
        this.expectedImg.evented = false;
        SideToSideView.lockCommon(this.expectedImg);

        // this.actualImg = await imageFromUrl(this.uriActual);
        this.actualImg = this.mainView.actualImage;
        this.actualImg.evented = false;
        SideToSideView.lockCommon(this.actualImg);

        this.divider = this.divider();
        // CLIPS
        this.actualRectClip = this.actualRectClip();
        SideToSideView.lockCommon(this.actualRectClip);
        this.actualImg.clipPath = this.actualRectClip;

        this.expectedRectClip = this.expectedRectClip();
        SideToSideView.lockCommon(this.expectedRectClip);
        this.expectedImg.clipPath = this.expectedRectClip;

        this.actualRectClip.width = (this.canvas.getWidth() / this.canvas.getZoom()) * 5;
        // this.expectedRectClip.width = 500;
        this.expectedRectClip.width = (this.canvas.getWidth() / this.canvas.getZoom()) * 5;

        this.actualRectClip.left = Math.max(this.mainView.expectedImage.width, this.mainView.expectedImage.width) / 2;
        this.expectedRectClip.left = Math.max(this.mainView.expectedImage.width, this.mainView.expectedImage.width) / 2
            - this.expectedRectClip.width;

        this.divider.left = Math.max(this.mainView.expectedImage.width, this.mainView.expectedImage.width) / 2;
        // RENDER
        await this.canvas.add(this.expectedImg);
        await this.canvas.add(this.actualImg);
        await this.canvas.add(this.divider);

        this.canvasLeft = document.getElementById('snapshoot')
            .getBoundingClientRect().x;

        this.canvasTop = document.getElementById('snapshoot')
            .getBoundingClientRect().y;

        this.addZoomEvents();
        this.addDividerFollowMouseEvents();

        // workaround for not draggable (and also without the col-resize cursor) divider
        setTimeout(() => {
            const delta = new fabric.Point(0, 0);
            this.canvas.relativePan(delta);
        }, 0);

        // workaround ro rescale divider
        setTimeout(() => {
            this.mainView.sliderView.zoomEventHandler();
            this.mainView.canvas.renderAll();
        }, 100);
        this.renderLabels();
    }

    async destroy() {
        delete this.actualImg?.clipPath;
        delete this.expectedImg?.clipPath;

        [
            this.actualImg,
            this.expectedImg,
            this.divider,
            this.actualLabel,
            this.expectedLabel,
            this.actualRectClip,
            this.expectedRectClip,
        ].forEach((item) => {
            this.canvas.remove(item);
        });
        delete this.canvas.backgroundImage;
        this.removeDividerFollowMouseEvents();
        this.removeZoomEvents();
        this.removeLabels();
    }
}
