/* eslint-disable no-unused-vars */
function wideSearchInput() {
    const el = document.getElementById('search-wrapper');
    el.style.setProperty('width', '75%', 'important');
}

function narrowSearchInput() {
    setTimeout(() => {
        const el = document.getElementById('search-wrapper');
        el.style.setProperty('width', '50%', 'important');
    }, 10);
}

function toggleSidebar() {
    const sidebar = document.getElementsByName('sidebar')[0];
    if (sidebar.classList.contains('hide')) {
        sidebar.classList.remove('hide');
        return;
    }
    sidebar.classList.add('hide');
}
