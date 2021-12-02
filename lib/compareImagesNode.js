const resemble = require('nodejs-resemble');

async function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const data = [];

        stream.on('data', (chunk) => {
            data.push(chunk);
        });

        stream.on('end', () => {
            resolve(Buffer.concat(data));
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
}

module.exports = function compareImages(image1, image2, options) {
    console.log({ options });
    return new Promise(
        (resolve, reject) => {
            try {
                console.log({ options });
                const ignoreTransform = {
                    antialiasing: 'ignoreAntialiasing',
                    colors: 'ignoreColors',
                    nothing: 'ignoreNothing',
                };
                const ignoreMethod = ignoreTransform[options.ignore] ? ignoreTransform[options.ignore] : 'ignoreAntialiasing';
                const outputOpts = options.output;
                resemble.outputSettings(
                    outputOpts
                );
                let ignoredRect;
                if (options.ignoreRectangles) {
                    ignoredRect = options.ignoreRectangles.map((it) => {
                        delete it.name;
                        return [it.left, it.top, it.right - it.left, it.bottom - it.top];
                    });
                }

                resemble(image1)
                    .compareTo(image2)[ignoreMethod]()
                    .ignoreRectangles(ignoredRect)
                    .onComplete(async (data) => {
                        console.log(data);
                        const stream = await data.getDiffImage();
                        const buffer = await streamToBuffer(stream.pack());
                        data.getBuffer = function () {
                            return buffer;
                        };
                        return resolve(data);
                    });
            } catch (e) {
                return reject(e);
            }
        }
    );
};
