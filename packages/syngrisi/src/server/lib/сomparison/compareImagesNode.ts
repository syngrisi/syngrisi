/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */


// @ts-ignore
import resemble from '@syngrisi/node-resemble.js';

async function streamToBuffer(stream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const data: Buffer[] = [];

        stream.on('data', (chunk: Buffer) => {
            data.push(chunk);
        });

        stream.on('end', () => {
            resolve(Buffer.concat(data));
        });

        stream.on('error', (err: Error) => {
            reject(err);
        });
    });
}

export default function compareImages(image1: any, image2: any, options: any): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            const ignoreTransform: any = {
                antialiasing: 'ignoreAntialiasing',
                colors: 'ignoreColors',
                nothing: 'ignoreNothing',
            };
            const ignoreMethod = ignoreTransform[options.ignore] ? ignoreTransform[options.ignore] : 'ignoreAntialiasing';
            const outputOpts = options.output;
            resemble.outputSettings(outputOpts);
            let ignoredRect;
            if (options.ignoreRectangles) {
                ignoredRect = options.ignoreRectangles.map((it: any) => {
                    delete it.name;
                    return [it.left, it.top, it.right - it.left, it.bottom - it.top];
                });
            }

            resemble(image1)
                .compareTo(image2)[ignoreMethod]()
                .ignoreRectangles(ignoredRect)
                .onComplete(async (data: any) => {
                    console.log(data);
                    const stream = await data.getDiffImage();
                    const buffer = await streamToBuffer(stream.pack());
                    data.getBuffer = function () {
                        return buffer;
                    };
                    resolve(data);
                });
        } catch (e) {
            reject(e);
        }
    });
}
