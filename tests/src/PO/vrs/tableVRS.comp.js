import Table from '../table.comp';

class TableVRSComp extends Table {
    constructor() {
        super();
        this.renew();
    }

    renew() {
        this._headers = ['checkbox', 'status', 'name', 'accepted', 'date', 'browser', 'platform', 'viewport'];
        this._lTable = 'div.table-rows';
        this._lRow = 'div.testinfo';
        this._lCell = 'div.cell';
        return this;
    }
}
module.exports.TableVRSComp = new TableVRSComp();
// export default TableVRSComp;
// export default new TableVRSComp();
