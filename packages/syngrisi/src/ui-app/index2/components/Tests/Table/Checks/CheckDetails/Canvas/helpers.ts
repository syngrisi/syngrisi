/* eslint-disable no-unused-vars */

/* global fabric */

import { fabric } from 'fabric';
import { log } from '@shared/utils/Logger';
import { errorMsg } from '@shared/utils';

function imageFromUrl(url: string) {
    return new Promise(
        (resolve, reject) => {
            try {
                fabric.Image.fromURL(
                    url, (img) => {
                        // eslint-disable-next-line no-param-reassign
                        img.objectCaching = false;
                        return resolve(img);
                    },
                );
            } catch (e) {
                log.error(`cannot create image from url, error: '${e}'`);
                reject(e);
            }
        },
    );
}

function lockImage(image: fabric.Image) {
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

export {
    lockImage,
    imageFromUrl,
};

function onImageErrorHandler(...e: any) {
    const imgSrc = e[0].path[0].src;
    const msg = `Cannot load image: '${imgSrc}'`;
    log.error(msg, e);
    errorMsg({ error: msg });
}

export function createImageAndWaitForLoad(src: string) {
    const timeout = 90000;
    const img = new Image();
    img.addEventListener('error', onImageErrorHandler);
    img.src = src;
    return Promise.race([
        new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
        }),
        new Promise((_, reject) => {
            setTimeout(
                () => reject(
                    new Error(`The image loading timeout is exceeded: '${timeout}' milliseconds, src: '${src}'`),
                ),
                timeout,
            );
        }),
    ]);
}
