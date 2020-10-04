function setSuiteMenuWidth() {
    const logoWidth = document.getElementById('logo-and-label-container').clientWidth
    document.getElementById('collapseSuiteMenu').style.width = (logoWidth ) + 'px'
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

function showNotification(msg, status = 'Success') {
    document.getElementById("notify-header").textContent = status;
    document.getElementById("notify-message").textContent = msg;
    document.getElementById("notify-rect").setAttribute('fill', '#2ECC40');
    if (status === 'Error')
        document.getElementById("notify-rect").setAttribute('fill', '#FF4136');
    $('#notify').show()
    setTimeout(function () {
            $('#notify').hide()
        },
        7000)
}

function removeOneCheck(id) {
    if (!confirmation()) return;
    removeCheck(id);
}

function removeCheck(id) {
    var xhr = new XMLHttpRequest();
    var params = `id=${id}`;
    xhr.open('DELETE', `/checks/${id}`, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Success ' + id + '--' + xhr.responseText);
            let checkDiv = document.getElementById(`check_${id}`);
            checkDiv.parentNode.removeChild(checkDiv);
            showNotification('The check was removed')
        } else {
            showNotification('Remove request was failing', 'Error');
            console.log('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(params);
}

async function acceptOneCheck(id, newBaselineId, oldBaselineId, testId) {
    if (!confirmation()) return;
    const regionData = await baselines[id].getRegionsData(oldBaselineId);
    if (regionData.ignoreRegions && regionData.ignoreRegions != 'undefined') {
        const confirm = confirmation('The previous baseline contains regions. Doy you want to copy them?')
        if (confirm) {
            baselines[id].sendIgnoreRegions(newBaselineId, JSON.parse(regionData.ignoreRegions));
            console.log('ignore region data was sent to new baseline snapshoot' + JSON.parse(regionData.ignoreRegions));
        }
    }
    let unfoldLocation;
    const cleanUrl = document.URL.replace(/[&?]{0,1}unfoldTestId=[^$&]{24}/g, '');

    if (cleanUrl.includes('?')) {
        unfoldLocation = cleanUrl + '&unfoldTestId=' + testId;
    } else {
        unfoldLocation = cleanUrl + '?unfoldTestId=' + testId;
    }
    acceptCheck(id, newBaselineId, () => location.href = unfoldLocation);
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
        if (regionData.ignoreRegions && regionData.ignoreRegions != 'undefined') {
            baselines[checkId].sendIgnoreRegions(actualId, JSON.parse(regionData.ignoreRegions));
            console.log('ignore region data was sent to new baseline snapshoot' + JSON.parse(regionData.ignoreRegions));
        }

        results.push(acceptCheck(checkId, actualId));
    }
    Promise.all(results).then((result) => {
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
            const params = `id=${id}&baselineId=${newBaselineId}&diffId&status=passed`;
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
    Promise.all(results).then(function (results) {
        showNotification('Tests were removed successfully')
        setTimeout(() => location.reload(), 800);
    }).catch((e) => {
        console.error(e);
        showNotification('Cannot remove tests')

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
            setTimeout(() => location.reload(), 1300);
        }
    ).catch(function (e) {
        showNotification('Cannot remove all suites');
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
