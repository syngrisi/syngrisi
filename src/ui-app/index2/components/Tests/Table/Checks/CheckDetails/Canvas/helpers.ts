/* eslint-disable no-unused-vars */

/* global fabric */

import { fabric } from 'fabric';

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
                console.error(`cannot create image from url, error: '${e}'`);
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
