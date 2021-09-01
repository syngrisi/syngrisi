const { setWorldConstructor, defineParameterType } = require('cucumber');

function CustomWorld() {
    this.STATE = {
        description: 'object to store data between steps',
        checks: [],
    };

    this.addCheck = function (check) {
        this.STATE.checks.push(check);
    };

    this.getAllChecks = function () {
        return this.STATE.checks;
    };

    this.clearChecks = function () {
        this.STATE.checks = [];
    };

    this.saveItem = function (itemName, params) {
        this.STATE[itemName] = params;
    };

    this.getSavedItem = function (itemName) {
        return this.STATE[itemName];
    };

    this.getSavedItems = function () {
        return this.STATE;
    };

    // this.fillPlaceholders = function (str) {
    //     return fillCommonPlaceholders(fillItemsPlaceHolders(str, this.getSavedItems()))
    // }

    this.fillItemsPlaceHolders = function fillItemsPlaceHolders(str) {

        // parse all placeholders like '<User: First Name>'
        let matches = (str).match(/<([^>^<]+?):([^>^<]+?)>/gm);
        if (!matches) {
            return str;
        }
        let resultStr = str;
        // parse item name and property in two regex group
        const r = new RegExp(`<([^>^<]+?):([^>^<]+?)>`);
        for (let ph of matches) {
            let found = r.exec(ph);
            const item = found[1].trim();
            console.log('ITEM', item);
            const property = found[2].trim();
            console.log('PROPERTY', property);

            resultStr = resultStr.replace(ph.trim(), this.getSavedItems()[item][property]);
        }
        return resultStr;
    };

}

setWorldConstructor(CustomWorld);
