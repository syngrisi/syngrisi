export class SimpleView {
    constructor(mainView, type) {
        this.mainView = mainView;
        this.type = type;
    }

    async render() {
        this.mainView.currentView = this.type;
        this.mainView.canvas.add(this.mainView[`${this.type}Image`]);

        this.mainView[`${this.type}Image`].sendToBack();

        // await initResize(this.mainView[`${this.type}Image`], this.mainView.canvas);

        // await this.mainView.panToCenter(this.mainView[`${this.type}Image`]);
    }

    destroy() {
        this.mainView.canvas.remove(this.mainView[`${this.type}Image`]);
    }
}
