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

function setProject(id) {
    Cookies.set('project', id);
    setTimeout(() => location.reload(), 300);
}

function renderNextPage(page) {
    return new Promise(async function (resolve, reject) {

        // add page=1 if empty
        const searchObject0 = searchToObject(window.location.search);
        // console.log({ searchObject0 });
        if (searchObject0 == null || (searchObject0 && !searchObject0.page)) {
            const updatedSearch0 = updateQueryParam('page', 1, window.location.search);
            updateUrlWithoutReloading(null, null, document.location.origin + document.location.pathname + updatedSearch0);
        }

        // prepare search URI part and get json data
        const searchObject = searchToObject(window.location.search);

        if (page) {
            searchObject.page = parseInt(page);
        }
        const project = Cookies.get('project');
        if (project) searchObject.filter_app_eq = project;
        const searchForDataPulling = getSearchForPageDataPulling(searchObject);
        // console.log({ searchObject });
        // console.log({ searchForDataPulling });
        window.removeEventListener('scroll', scroller);
        let json = await getRequest(`/checks${searchForDataPulling}`);
        // console.log(json);
        window.addEventListener('scroll', scroller);

        // prepare testHTML using ejs template and obtained json data
        const checksByTestGroupedByIdent = JSON.parse(json);
        // console.log({ checksByTestGroupedByIdent });
        let options = { delimiter: '?' };
        const pageTemplate = await getRequest('../../../static/ejs/tests_table_rows.ejs');
        let testsHtml = '<div class="test-page-wrapper row ml-0 mr-0">' + ejs.render(pageTemplate, {
            checksByTestGroupedByIdent: checksByTestGroupedByIdent
        }, options) + '</div>';

        // insert HTML
        document.getElementById('tests-table-end')
            .insertAdjacentHTML('beforebegin', testsHtml);

        let pageNum;
        if (searchObject) {
            // pageNum = (searchObject.page && parseInt(searchObject.page) !== 1) ? (parseInt(searchObject.page) + 1) : 1
            pageNum = (searchObject.page) ? (parseInt(searchObject.page) + 1) : 1;
        } else {
            pageNum = 1;
        }

        const updatedSearch = updateQueryParam('page', pageNum, window.location.search);
        if (json === '{}') {
            window.removeEventListener('scroll', scroller);
            return resolve(json);
        } else {
            updateUrlWithoutReloading(null, null, document.location.origin + document.location.pathname + updatedSearch);
            return resolve(json);
        }
    });
}

function paramsToObject(entries) {
    const result = {};
    for (const [key, value] of entries) { // each 'entry' is a [key, value] tupple
        result[key] = value;
    }
    return result;
}

const queryObject = paramsToObject(window.location.search);

function getSearchForPageDataPulling(searchObject) {

    if (!searchObject) return '';

    const allowed = ['sort', 'page', 'filter'];

    const checker = value =>
        allowed.some(element => value.includes(element));

    const filteredSearch = Object.keys(searchObject)
        .filter(checker)
        .reduce((obj, key) => {
            obj[key] = searchObject[key];
            return obj;
        }, {});
    const searchForDataPulling = objectToSearch(filteredSearch);
    return '?' + searchForDataPulling;
}

async function scroller() {
    console.log('scroller');
    let lastScroll = 0;

    // function () {
    let currentScroll = document.documentElement.scrollTop || document.body.scrollTop; // Get Current Scroll Value

    if (currentScroll > 0 && lastScroll <= currentScroll) {
        await renderNextPage();
        lastScroll = currentScroll;
    } else {
        lastScroll = currentScroll;
    }
}

async function firstPaginatorLoad() {
    const searchObject = searchToObject(window.location.search);
    let pageNum;
    // load all pages that are in query like: 'page=10'
    if (searchObject && searchObject.page > 1) {
        console.log('preload pages > 1');

        pageNum = parseInt(searchObject.page);
        const pagesArray = Array.from(Array(pageNum)
            .keys());
        for (const i of pagesArray) {
            await renderNextPage(i + 1);
        }
    } else {
        // just load few pages to enable scroll, because there is no way to trigger scroll event otherwise
        console.log('preload pages');
        for (const i of Array.from(Array(3)
            .keys())) {
            // console.log({ i });
            await renderNextPage();
        }
    }
}

async function generateApiKey() {
    if (!confirmation('After generate the Api Key, you MUST reconfigure the solution. Are you sure?')) return;
    await getRequest('/apikey')
        .then((result) => {
            return showNotification(JSON.parse(result).apikey, 'SuccessInput', 1000 * 40);
        })
        .catch((e) => {
            console.log(`error api key generation: ${e}`);
            return showNotification(e, 'Error', 1000 * 60);
        });
}
