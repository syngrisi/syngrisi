export class SimpleView {
    constructor(mainView, type) {
        this.mainView = mainView;
        this.type = type;
    }

    render() {
        // Safety check: if mainView is disposed or canvas is missing, abort
        if (!this.mainView || !this.mainView.canvas) return;

        // Safety check: verify we are still the expected view type
        // This prevents a stale SimpleView from rendering into a MainView that has switched context
        // However, MainView controls this, so primary check is usually there.
        // But we can check if the image object exists before adding.
        const imgObj = this.mainView[`${this.type}Image`];
        if (!imgObj) return;

        this.mainView.currentView = this.type;
        try {
            this.mainView.canvas.add(imgObj);
            imgObj.sendToBack();
            // Center immediately to avoid visual "shake" on load
            this.mainView.panToCanvasWidthCenter(`${this.type}Image`);
        } catch (e) {
            // Ignore errors if canvas is in invalid state during rapid navigation
            console.warn('[SimpleView] render failed (likely navigation race):', e);
        }
    }

    destroy() {
        if (!this.mainView || !this.mainView.canvas) return;
        const imgObj = this.mainView[`${this.type}Image`];
        if (imgObj) {
            try {
                this.mainView.canvas.remove(imgObj);
            } catch (e) {
                // Ignore errors on removal
            }
        }
    }
}
