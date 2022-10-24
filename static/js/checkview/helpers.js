/* eslint-disable no-unused-vars */
/* global ejs */

// eslint-disable-next-line no-unused-vars
async function renderSameNamedChecks(check, lastChecksWithSameName) {
    const pageTemplate = await fetch('../../../static/ejs/check_sidebar.ejs');
    document.getElementById('sidebar').innerHTML = await ejs.render(
        await pageTemplate.text(),
        { check, lastChecksWithSameName },
        { async: true },
    );
}

// eslint-disable-next-line no-unused-vars
async function renderNextAndPrevButtons(prevCheckId, nextCheckId) {
    const prevButton = document.getElementById('previous');
    if (prevCheckId) {
        prevButton.parentElement.setAttribute('disabled', 'false');
        prevButton
            .setAttribute('href', `checkview?id=${prevCheckId}`);
    } else {
        prevButton.parentElement.setAttribute('disabled', 'true');
    }
    const nextButton = document.getElementById('next');
    if (nextCheckId) {
        nextButton.parentElement.setAttribute('disabled', 'false');
        document.getElementById('next')
            .setAttribute('href', `checkview?id=${nextCheckId}`);
    } else {
        nextButton.parentElement.setAttribute('disabled', 'true');
    }
}

function calculateExpectedCanvasViewportAreaSize() {
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const canvasDimensions = document.getElementById('snapshoot')
        .getBoundingClientRect();
    return {
        width: viewportWidth - canvasDimensions.x,
        height: viewportHeight - canvasDimensions.y,
    };
}

function calculateImageWidth(image, canvas) {
    let { width } = image;
    const isHigh = () => (image.height > calculateExpectedCanvasViewportAreaSize().height)
        && ((image.height / calculateExpectedCanvasViewportAreaSize().height) < 10);

    if (isHigh()) {
        width = image.width * (calculateExpectedCanvasViewportAreaSize().height / image.height);
    }
    const isExtraSmall = () => image.height < 50;
    if (isExtraSmall()) width *= 2;

    if (width > canvas.width) {
        width = canvas.width;
    }
    return width;
}

async function initResize(image, canvas) {
    image.scaleToWidth(calculateImageWidth(image, canvas) * canvas.getZoom());
}

function imageFromUrl(url) {
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

function lockImage(image) {
    image.set({
        lockScalingX: true,
        lockScalingY: true,
        lockMovementX: true,
        lockMovementY: true,
        hoverCursor: 'default',
        hasControls: false,
        selectable: false,
    });
    return image;
}
