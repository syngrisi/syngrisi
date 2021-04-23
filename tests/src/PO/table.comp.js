export default class TableComp {
    constructor() {
        this._lTable = '//table';
        this._lRow = './/tr';
        this._lCell = './/td';

        this.data = [];
    }

    init() {
        this.data = this.collectData();
        return this;
    }

    // return string array of headers
    headers(index) {
        return this._headers[index];
    }

    // Locators
    get lCell() {
        return this._lCell;
    }

    get lRow() {
        return this._lRow;
    }

    get lTable() {
        return this._lTable;
    }

    tableEl() {
        return $(this.lTable);
    }

    // return array of rows elements
    rowsEls() {
        return this.tableEl()
            .$$(this.lRow);
    }

    // return array of cells elements
    cellsEls(row) {
        return row.$$(this.lCell);
    }

    // Queries
    collectData() {
        const classThis = this;
        const data = [];
        this.rowsEls()
            .forEach(
                function (row) {
                    const cells = classThis.cellsEls(row);
                    const cellsData = {};
                    cells.forEach(
                        function (cellEl, index) {
                            cellsData[classThis.headers(index)] = cellEl;
                        }
                    );
                    data.push(cellsData);
                }
            );
        return data;
    }
}
