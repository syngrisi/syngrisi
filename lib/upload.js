const fs = require('fs');
const request = require('request');
const FormData = require('form-data');
const { config } = require('../config');

const uploadBaseline = async function (filepath, url = 'http://vrs:3000/', name = 'TestName',) {
    return new Promise(async function (resolve, reject) {
        // const path = `../${config.defaultBaselinePath}${filepath}`;
        const form = new FormData();
        form.append('appname', 'TestApplication');
        form.append('suitename', 'SuiteName03');
        form.append('testname', 'TestName03');
        form.append('name', 'CheckName03');
        form.append('path', filepath);
        form.append('filename', filepath);
        form.append('file', fs.createReadStream(filepath));

       let response = null;
        await form.getLength(async (err, length) => {
            const r = await request.post({
                    url,
                },
                (error, res, body) => {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    // console.log(res.statusCode);
                    response = JSON.stringify(body)
                    console.log(JSON.stringify(body));
                });
            r._form = form;
        });
        resolve(response);
    });
};

(async function () {
    await uploadBaseline('../../tests/BaselineImages/testAssertsExampes/test2.png', 'http://vrs:3000/checks');
    await uploadBaseline('../../tests/BaselineImages/testAssertsExampes/test2a.png', 'http://vrs:3000/checks');
})();




exports.uploadBaseline = uploadBaseline;
