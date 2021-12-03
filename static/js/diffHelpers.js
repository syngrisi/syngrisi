/* global window document */
function backToTest(id) {
    window.location = `${document.referrer}&unfoldTestId=${id}`;
}

async function acceptAndRedirect(checkId, actualId, expectedId, diffId, testId) {
    await acceptOneCheck(checkId, actualId, expectedId, testId, false);
    redirectToNewDiffAfterAccept(checkId, actualId, diffId);
}

function redirectToUpdatedCheckAfterAccept(id) {
    const newUri = `/checkview?id=${id}`;
    window.location.href = newUri;
}

async function acceptAndRedirect2(params) {
    await acceptOneCheck(params.checkId, params.actualId, params.expectedId, params.testId, false);
    setTimeout(() => {
        redirectToUpdatedCheckAfterAccept(params.checkId);
    }, 300);
}

function toggleDiffToolbarCollapse() {
    const wrapper = document.getElementsByClassName('toolbar-wrapper')[0];
    const buttonsEl = document.getElementById('diff-toolbar-buttons');
    const collapseIcon = document.getElementById('diff-collapse-icon');
    if (buttonsEl.style.display === 'none') {
        wrapper.style.marginRight = '0';
        buttonsEl.style.display = 'inline-block';
        collapseIcon.src = '../../../../static/icons/collapse.svg';
        return;
    }
    collapseIcon.src = '../../../../static/icons/expand.svg';
    wrapper.style.marginRight = '-7px';
    buttonsEl.style.display = 'none';
}

function setMatchType(type, id) {
    const buttonElement = document.getElementById('dropdownMenuButton');
    sendMatchType(id, type);
    buttonElement.innerText = 'Ignore ' + type;
}

function sendMatchType(id, type) {
    const xhr = new XMLHttpRequest();
    const params = `id=${id}&matchType=${type}`;
    xhr.open('PUT', `/snapshots/${id}`, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(`Successful send snapshot match type data, id: '${id}'  resp: '${xhr.responseText}'`);
            showNotification('Match type was saved');
        } else {
            console.error(`Cannot set snapshot match type , status: '${xhr.status}',  resp: '${xhr.responseText}'`);
            showNotification('Cannot set snapshot match type', 'Error');
        }
    };
    xhr.send(params);
}
