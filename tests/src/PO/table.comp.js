export default class TableComp {
    constructor() {
        this._lTable = "//table";
        this._lRow = ".//tr";
        this._lCell = './/td';

        this.data = [];
        // this.registerPO()
    }
    // registerPO(){
    //     global.PO[this.constructor.name] = this;
    // }

    init() {
        this.data = this.collect_data();
        return this
    }

    // return string array of headers
    headers(index) {
        return this._headers[index]
    }

    // Locators
    get lCell() {
        return this._lCell;
    }

    get lRow() {
        return this._lRow;
    }

    get lTable() {
        return this._lTable
    }

    table_el() {
        return $(this.lTable)
    }

    //return array of rows elements
    rows_els() {
        return this.table_el().$$(this.lRow)
    }

    //return array of cells elements
    cells_els(row) {
        return row.$$(this.lCell)
    }

    // Queries
    collect_data() {
        const classThis = this;
        let data = [];
        this.rows_els().forEach(
            function (row) {
                const cells = classThis.cells_els(row)
                let cells_data = {};
                cells.forEach(
                    function (cell_el, index) {
                        cells_data[classThis.headers(index)] = cell_el;
                    }
                )
                data.push(cells_data)
            }
        )
        return data
    }
}
