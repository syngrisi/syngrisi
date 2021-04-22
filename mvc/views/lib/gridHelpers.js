function setSuiteMenuWidth() {
    const logoWidth = document.getElementById('logo-and-label-container').clientWidth
    document.getElementById('collapseSuiteMenu').style.width = (logoWidth) + 'px'
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function redrawCheckAcceptedStatus(id) {
    try {
        const check = JSON.parse(await getRequest(`check/${id}`));
        const icon = document.getElementsByClassName(`check-accept-button-check-id_${id}`)[0];
        if (check.markedAs === 'accepted') {
            icon.classList.contains('not-accepted-button-icon') && icon.classList.remove('not-accepted-button-icon');
            !icon.classList.contains('accepted-button-icon') && icon.classList.add('accepted-button-icon');
            icon.setAttribute('title', check.markedByUsername ? `Accepted by: ${check.markedByUsername} \n Accepted date: ${check.markedDate}` : 'Click here to accept this check')
        }
    } catch (e) {
        console.log(`cannot redraw accept check icon with id: '${id}' error: '${e}'`)
    }
}

async function redrawTestAcceptedStatus(id) {
    try {
        const test = JSON.parse(await getRequest(`test/${id}`));
        const acceptedStatus = test.markedAs ? test.markedAs : 'Unaccepted'
        const label = document.getElementsByClassName(`check-accept-label-test-id_${id}`)[0];
        label.innerText = acceptedStatus;
    } catch (e) {
        console.log(`cannot redraw accept test status with id: '${id}' error: '${e}'`)
    }
}

async function removeTestFromDomIfEmpty(id) {
    try {
        const resp = await getRequest(`/checks?filter_id_eq=${id}`);
        if (resp !== '{}') {
            const tests = JSON.parse(await getRequest(`/checks?filter_id_eq=${id}`, true));
            const len = Object.keys(tests[id]).filter(x => x.includes('ident')).length;
            if (len < 1) {
                console.log(document.getElementsByClassName(`testinfo_${id}`));
                document.getElementsByClassName(`testinfo_${id}`)[0].remove();
            }
        } else {
            console.log(document.getElementsByClassName(`testinfo_${id}`));
            document.getElementsByClassName(`testinfo_${id}`)[0].remove();
        }
    } catch (e) {
        console.log(`cannot redraw accept test status with id: '${id}' error: '${e}'`)
    }
}

function updateQueryParam(param, newval, url) {
    const searchParams = new URLSearchParams(url);
    searchParams.delete(param);
    // console.log(searchParams.toString());
    searchParams.set(param, newval);
    // console.log(searchParams.toString());
    return "?" + searchParams.toString();
}

function removeQueryParamContains(search, word) {
    const searchParams = new URLSearchParams(search);

    console.log(searchParams.toString())
    let toDelete = [];
    for (var pair of searchParams.entries()) {

        console.log(pair[0] + ', ' + pair[1]);
        if (pair[0].toString().includes(word)) {
            toDelete.push(pair[0]);
        }
    }

    toDelete.forEach(x => searchParams.delete(x));

    return searchParams.toString();
}

function searchToObject(search) {
    if (!search)
        return null;
    return JSON.parse('{"' + decodeURI(search).replace('?', '').replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

function objectToSearch(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

function sort2(prop, order = -1) {
    const currentSearch = window.location.search;

    const r = new RegExp(`sort_${prop}_([^\d]{0,1}[1]{1,1})`);
    console.log(r);
    let parsedOrder;
    if (currentSearch.match(r)) {
        parsedOrder = currentSearch.match(r)[1];
        // console.log({ parsedOrder });
    }
    const inverseOrder = parsedOrder === '1' ? '-1' : '1'

    const clearedSearch = removeQueryParamContains(currentSearch, 'sort_');
    let updatedSearch = updateQueryParam(`sort_${prop}_${inverseOrder || order}`, 'true', clearedSearch)
    // console.log({ updatedSearch });
    document.location.href = document.location.origin + updatedSearch;
}

function updateUrlWithoutReloading(page, title, url) {
    if ("undefined" !== typeof history.pushState) {
        history.pushState({ page: page }, title, url);
    } else {
        window.location.assign(url);
    }
}

function sort(prop, order = -1) {
    const currentUri = document.location.href;
    if (currentUri.includes(`sortprop=${prop}`) && currentUri.includes('order=-1')) {
        order = 1
    }

    let clearedUri = currentUri.replace(/[&]{0,1}(sortorder=[-]{0,1}.)/, "");
    clearedUri = clearedUri.replace(/[&]{0,1}sortprop=\w+/, "");

    let outUri;
    if (clearedUri.includes('?')) {
        outUri = clearedUri + `&sortprop=${prop}&sortorder=${order}`;
    } else {
        outUri = clearedUri + `?sortprop=${prop}&sortorder=${order}`;
    }
    outUri = outUri.replace("?&", "?");

    document.location.href = outUri;
}

function showNotification(msg, status = 'Success', timeout = 7000) {
    if (status === 'SuccessInput') {
        const textArea = document.createElement('textarea');
        textArea.id = 'notification-textarea'
        textArea.classList.add('w-100');

        textArea.innerText = msg;
        document.getElementById("notify-message").appendChild(textArea);
        document.getElementById("notify-header").textContent = 'Success';
    } else {
        document.getElementById("notify-header").textContent = status;
        document.getElementById("notify-message").textContent = msg;
    }

    document.getElementById("notify-rect").setAttribute('fill', '#2ECC40');
    if (status === 'Error')
        document.getElementById("notify-rect").setAttribute('fill', '#FF4136');
    $('#notify').show()
    setTimeout(function () {
            status === 'Success' && $('#notify').hide()
        },
        timeout);
}

async function removeOneCheck(id, testId) {
    if (!confirmation()) return;
    await removeCheck(id, testId);
    await removeTestFromDomIfEmpty(testId)
    await redrawTestAcceptedStatus(testId);
}

function removeCheck(id, testId) {
    return new Promise((resolve, reject) => {
        try {
            const xhr = new XMLHttpRequest();
            const params = `id=${id}`;
            xhr.open('DELETE', `/checks/${id}`, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            xhr.onload = async function () {
                if (xhr.status === 200) {
                    console.log('Success ' + id + '--' + xhr.responseText);
                    let checkDiv = document.getElementById(`check_${id}`);
                    checkDiv.parentNode.removeChild(checkDiv);
                    showNotification('The check was removed')
                    return resolve();
                } else {
                    showNotification('Remove request was failing', 'Error');
                    console.log('Request failed.  Returned status of ' + xhr.status);
                    return reject('Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send(params);
        } catch (e) {
            console.log(`error in removeCheck: '${e}'`);
        }
    })
}

async function acceptOneCheck(id, newBaselineId, oldBaselineId, testId) {
    if (!confirmation()) return;
    const regionData = await baselines[id].getRegionsData(oldBaselineId);
    //  !== 'undefined' - is for back compatibility
    if (regionData.ignoreRegions && regionData.ignoreRegions !== 'undefined') {
        const confirm = confirmation('The previous baseline contains regions. Doy you want to copy them?')
        if (confirm) {
            baselines[id].sendIgnoreRegions(newBaselineId, JSON.parse(regionData.ignoreRegions));
            console.log('ignore region data was sent to new baseline snapshoot' + JSON.parse(regionData.ignoreRegions));
        }
    }

    await acceptCheck(id, newBaselineId, () => {
    });

    await redrawCheckAcceptedStatus(id);
    await redrawTestAcceptedStatus(testId);
}

async function acceptSelectedChecks() {
    if (!confirmation('Please pay attention to everything regions\' data will be copied to new baselines. Are you sure? Are you sure?')) return;
    let checkboxes = document.querySelectorAll('input[name=check-input]:checked');
    let results = [];
    for (const checkbox of checkboxes) {
        const checkId = checkbox.getAttribute('id');
        const baselineId = checkbox.getAttribute('baselineId');
        const actualId = checkbox.getAttribute('actualId');
        const regionData = await baselines[checkId].getRegionsData(baselineId);
        if (regionData.ignoreRegions) {
            baselines[checkId].sendIgnoreRegions(actualId, JSON.parse(regionData.ignoreRegions));
            console.log('ignore region data was sent to new baseline snapshoot' + JSON.parse(regionData.ignoreRegions));
        }

        results.push(acceptCheck(checkId, actualId));
    }
    Promise.all(results).then(async (result) => {
        location.reload();
    }).catch(e => {
        console.log(e);
    })
}

function acceptCheck(id, newBaselineId, callback) {
    return new Promise((resolve, reject) => {
        try {
            const xhr = new XMLHttpRequest();
            // send empty diffid
            const params = `id=${id}&baselineId=${newBaselineId}&diffId&accept=true`;
            console.log(params);
            xhr.open('PUT', `/checks/${id}`, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            xhr.onload = function () {
                if (xhr.status === 200) {
                    showNotification(`The check '${id}' was accepted`)

                    console.log('Success ' + id + '--' + xhr.responseText);
                    if (callback)
                        callback();
                    return resolve(xhr);
                } else {
                    console.log('Request failed. Returned status of ' + xhr.status + 'resp:' + xhr.responseText);
                }
            };
            xhr.send(params);
        } catch (e) {
            return reject(e);
        }
    })
}

function removeTest(id) {
    return new Promise(function (resolve, reject) {
        try {
            const xhr = new XMLHttpRequest();
            const params = `id=${id}`;
            xhr.open('DELETE', `/tests/${id}`, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            xhr.onload = function () {
                if (xhr.status === 200) {
                    console.log('Success ' + id + '--' + xhr.responseText);
                    return resolve(xhr);
                } else {
                    console.log('Request failed.  Returned status of ' + xhr.status);
                    return reject(xhr);
                }
            };
            xhr.send(params);
        } catch (e) {
            return reject(e);
        }
    })

}

function removeTests() {
    if (!confirmation()) return;
    let checkboxes = document.querySelectorAll('input[name=test]:checked');
    let results = []
    for (const checkbox of checkboxes) {
        results.push(removeTest(checkbox.id))
    }
    Promise.all(results).then(async function (results) {
        showNotification('Tests were removed successfully')
        setTimeout(() => location.reload(), 800);
    }).catch((e) => {
        console.error(e);
        showNotification('Cannot remove tests', 'Error')
    })
}

function removeSuite(id) {
    return new Promise(function (resolve, reject) {
        try {
            const xhr = new XMLHttpRequest();
            const params = `id=${id}`;
            xhr.open('DELETE', `/suites/${id}`, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            xhr.onload = function () {
                if (xhr.status === 200) {
                    console.log(`Suite was successfully removed, id: '${id}', resonse test: '${xhr.responseText}'`);
                    return resolve(xhr)
                } else {
                    console.log('Cannot remove the suite. Request is failed.  Returned status of ' + xhr.status);
                    reject(xhr)
                }
            };
            xhr.send(params);
        } catch (e) {
            return reject(e)
        }
    })
}

function removeCheckedSuites() {
    if (!confirmation()) return;
    let checkboxes = document.querySelectorAll('input[name=suite-item]:checked');
    let result = [];
    for (const checkbox of checkboxes) {
        result.push(removeSuite(checkbox.getAttribute('suiteid')));
    }
    Promise.all(result).then(
        function () {
            showNotification('All suites were removed');
            setTimeout(() => location.reload(), 1000);
        }
    ).catch(function (e) {
        showNotification('Cannot remove all suites', 'Error');
        console.error('Cannot remove all suites, error: ' + e);
    })
}

function checkAllTests() {
    let checkboxes = document.querySelectorAll('input[name=test]');
    console.log(`Checked: '${checkboxes.length}'`)
    checkboxes.forEach(function (ch) {
        if (ch.checked === false) {
            ch.checked = true;
        } else {
            ch.checked = false;
        }
    });
}

function checkAllSuites() {
    let checkboxes = document.querySelectorAll('input[name=suite-item]');
    console.log(`Checked: '${checkboxes.length}'`)
    checkboxes.forEach(function (ch) {
        if (ch.checked === false) {
            ch.checked = true;
        } else {
            ch.checked = false;
        }
    });
}

function checkAllItems(name) {
    let checkboxes = document.querySelectorAll(`input[name=${name}]`);
    console.log(`Checked: '${checkboxes.length}'`)
    checkboxes.forEach(function (ch) {
        if (ch.checked === false) {
            ch.checked = true;
        } else {
            ch.checked = false;
        }
    });
}

function confirmation(text = 'are you sure?') {
    const answer = window.confirm(text);
    console.log(answer);
    return answer;
}

function getRequest(path, verbose) {
    return new Promise((resolve, reject) => {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', path, true);

            xhr.onload = function () {
                if (xhr.status === 200) {
                    verbose && console.log(`Successfully finish get request for: '${path}', resp: '${xhr.responseText}'`);
                    console.log(`Successfully finish get request for: '${path}'`);
                    return resolve(xhr.responseText);
                } else {
                    console.log('Request failed. Returned status of ' + xhr.status + ' resp:' + xhr.responseText);
                    return reject(xhr.responseText);
                }
            };
            xhr.send();
        } catch (e) {
            return reject(e);
        }
    })
}

function drawTestChecksPreviews(testId) {
    var checksDivs = Array.prototype.slice.call(document.getElementById(`testchecks_${testId}`).children);
    let checksIds = []
    checksDivs.forEach(el => checksIds.push(el.id.replace('check_', '')))

    let baselineIds = []
    checksDivs.forEach(el => baselineIds.push(el.getAttribute('baselineId')))

    let diffsIds = []
    checksDivs.forEach(el => diffsIds.push(el.getAttribute('diffId')))

    let statuses = []
    checksDivs.forEach(el => statuses.push(el.getAttribute('checkStatus')))
    console.log(statuses)

    checksIds.forEach(async function (id, index) {

        let baseline = {};
        fabric.Object.prototype.objectCaching = false;
        const snapshotId = ((statuses[index] === 'new') || (statuses[index] === 'passed') || (statuses[index] === 'blinking')) ? baselineIds[index] : diffsIds[index]
        const snapshoot = JSON.parse(await getRequest(`/snapshot/${snapshotId}`));
        const baselineObj = JSON.parse(await getRequest(`/snapshot/${baselineIds[index]}`));
        // console.log({snapshoot})

        fabric.Image.fromURL(`/snapshoots/${snapshoot.filename || snapshotId + '.png'}`, function (oImg) {
            baseline = new BaselineView('canvas_snapshoot_' + id,
                oImg,
                {
                    weight: document.getElementById('canvas_snapshoot_' + id).offsetWidth,
                    backimageId: baselineObj.filename ? baselineObj.filename : baselineObj.id + '.png'
                }
            );
            baseline.getSnapshotIgnoreRegionsDataAndDrawRegions(baselineIds[index]);
            baseline.canvas.hoverCursor = "pointer";
            baselines[id] = baseline;
        })
    })
}

