const getElementsByPositionFromDump = function getElementsByPositionFromDump(x, y, dump) {

    // check if position is gets into dumped elements rects boundaries
    const data = JSON.parse(dump)
        .filter(function (item) {
            return (x >= item.left) &&
                (x <= item.right) &&
                (y >= item.top) &&
                (y <= item.bottom)
        })
        // very little weight of 'domPath.length' value this will impact only if areas (width * height) is the same
        // .sort((a, b) => (a.width * a.height - a.domPath.length / 100) > (b.width * b.height - b.domPath.length / 100) ? 1 : -1)

        // .sort((a, b) => ( a.domPath.length + (a.width * a.height)/ 100) < (b.domPath.length + (b.width * b.height)/ 100) ? 1 : -1)
        .sort((a, b) => (a.domPath.length) < (b.domPath.length) ? 1 : -1)
    if (data.length < 1) {
        throw new Error(`Cannot find element in the dump file, for x: '${x}' y: '${y}'`)
    }
    const pos = data[0];
    return {
        tag: pos.tag,
        id: pos.id,
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height,
        domPath: pos.domPath,
        request: `${x}, ${y}`
    }
    return pos
}

const getAllElementsByPositionFromDump = function getAllElementsByPositionFromDump(dump, positions) {
    let dumpResults = {};
    // let dumpResults2 = new Set();
    for (const position of positions) {
        const el = getElementsByPositionFromDump(position.x, position.y, dump);
        // to make dump unique
        const key = `${el.tag}_${el.id}_${el.x}_${el.y}_${el.width}_${el.height}_${el.domPath.toString()}`;
        dumpResults[key] = el;
        // dumpResults2.add(getElementsByPositionFromDump(position.x, position.y, dump))
    }
    return Object.values(dumpResults).map(x => x)
}

module.exports = {
    getElementsByPositionFromDump: getElementsByPositionFromDump,
    getAllElementsByPositionFromDump: getAllElementsByPositionFromDump,
}
