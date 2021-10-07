/* global window document */
function backToTest(id) {
    window.location = `${document.referrer}&unfoldTestId=${id}`;
}

async function acceptAndRedirect(checkId, actualId, expectedId, diffId, testId) {
    await acceptOneCheck(checkId, actualId, expectedId, testId, false);
    redirectToNewDiffAfterAccept(checkId, actualId, diffId);
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
