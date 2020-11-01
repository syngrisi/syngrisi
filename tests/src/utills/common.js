// const moment = require('moment');
const fs = require('fs');
const got = require('got');
// const {JSDOM} = require("jsdom");
// const faker = require('faker');
// const quotedPrintable = require('quoted-printable');
const ImageJS = require("imagejs");
// const node_xj = require("xls-to-json");
// const XLSX = require('xlsx');


const saveRandomImage = async function saveRandomImage(fullPath) {
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    const size = 30;
    return new Promise(resolve => {
        const bitmap = new ImageJS.Bitmap({width: size, height: size});
        for (const val of [...Array(size)]) {
            bitmap.setPixel(getRandomInt(size), getRandomInt(size), 255, 1, 1, 255);
        }
        bitmap.writeFile(fullPath, {type: ImageJS.ImageType.PNG})
            .then(function () {
                resolve()
            });
    });
}

module.exports = {
    saveRandomImage,
};
