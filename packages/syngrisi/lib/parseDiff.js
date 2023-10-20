const Canvas = require('canvas');

const loop = function loop(w, h, callback) {
    let x;
    let y;

    for (x = 0; x < w; x++) {
        for (y = 0; y < h; y++) {
            callback(x, y);
        }
    }
};

const parseDiff = function (dataDiff) {
    console.log('Start parse diff - prepare data');
    Img = Canvas.Image;
    let image = new Img();
    image.src = dataDiff;
    const width = image.width;
    const height = image.height;

    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    const sourceImageData = ctx.getImageData(0, 0, width, height).data;

    let diffPixCount = 0;
    let allPixCount = 0;
    let positions = [];
    let s = {};
    console.log('Start collect diff pixel positions');
    loop(width, height, async function (horizontalPos, verticalPos) {
        let offset = (verticalPos * width + horizontalPos) * 4;
        let red = sourceImageData[offset];
        let green = sourceImageData[offset + 1];
        let blue = sourceImageData[offset + 2];
        let alpha = sourceImageData[offset + 3];
        if (!s[`${red}, ${green}, ${blue}, ${alpha}`]) {
            s[`${red}, ${green}, ${blue}, ${alpha}`] = 1;
        }

        s[`${red}, ${green}, ${blue}, ${alpha}`] = s[`${red}, ${green}, ${blue}, ${alpha}`] + 1;

        if
        (
            ((red === 252) && (green === 0) && (blue === 236)) ||
            ((red === 196) && (green === 0) && (blue === 132)) ||
            ((red === 255) && (green === 0) && (blue === 255))
        ) {

            diffPixCount++;
            positions.push({
                x: horizontalPos,
                y: verticalPos
            });
        }

        allPixCount++;
    });
    console.log(s);
    console.log(`'${diffPixCount}' diff pixels positions  of '${allPixCount}' was collected`);
    console.log('Start sorting pixel positions by "y"');
    const out = positions.sort((a, b) => (a.y > b.y) ? 1 : -1);
    console.log('End of sorting');
    return out;
};

module.exports = {
    parseDiff,
    loop
}
