const getElementsByPositionFromDump = function getElementsByPositionFromDump(x, y, dump, offset = 1) {
    return new Promise(function (resolve, reject) {
        try {
            // resolve(JSON.parse(dump)[0])
            // check if position is gets into dumped elements rects boundaries
            let data = dump
                .filter(function (item) {
                    return (x >= item.left) &&
                        (x <= item.right) &&
                        (y >= item.top) &&
                        (y <= item.bottom)
                }).sort((a, b) => (a.domPath.length) < (b.domPath.length) ? 1 : -1)
            if (data.length < 1) {
                return resolve(null);
            }
            const pos = data[0];
            return resolve({
                tag: pos.tag,
                id: pos.id,
                x: pos.x,
                y: pos.y,
                width: pos.width,
                height: pos.height,
                domPath: pos.domPath,
                request: `${x}, ${y}`
            });
        } catch (e) {
            return reject(e)
        }
    })
}
const getAllElementsByPositionFromDump = function getAllElementsByPositionFromDump(dump, positions) {
    return new Promise(function (resolve, reject) {
        try {
            const percent = (positions.length / 100);
            let executionTimer = process.hrtime()
            console.log(`Start parse elements from dump based on diff`);
            let promResults = [];
            for (const position of positions) {
                const el = getElementsByPositionFromDump(position.x, position.y, dump);
                promResults.push(el)

            }
            console.log(`Promises formed, time: ${process.hrtime(executionTimer).toString()}`)

            let dumpResults = {};
            Promise.all(promResults).then((values) => {
                console.log(`Promises resolved, time: ${process.hrtime(executionTimer).toString()}`)
                for (el of values) {
                    // to make dump unique
                    if (el !== null) {
                        const key = `${el.tag}_${el.id}_${el.x}_${el.y}_${el.width}_${el.height}_${el.domPath.toString()}`;
                        dumpResults[key] = el;
                    }
                }
                console.log(`End parse elements from dump based on diff, time: '${process.hrtime(executionTimer).toString()}'`);
                return resolve(Object.values(dumpResults).map(x => x));
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getElementsByPositionFromDump: getElementsByPositionFromDump,
    getAllElementsByPositionFromDump: getAllElementsByPositionFromDump,
}
