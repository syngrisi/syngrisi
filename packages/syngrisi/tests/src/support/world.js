const { setWorldConstructor } = require('@cucumber/cucumber');

// eslint-disable-next-line require-jsdoc
function CustomWorld() {
    this.STATE = {
        description: 'object to store data between steps',
        checks: [],
    };

    this.addCheck = function addCheck(check) {
        this.STATE.checks.push(check);
    };

    this.getAllChecks = function getAllChecks() {
        return this.STATE.checks;
    };

    this.clearChecks = function clearChecks() {
        this.STATE.checks = [];
    };

    this.saveItem = function saveItem(itemName, params) {
        this.STATE[itemName] = params;
    };

    this.getSavedItem = function getSavedItem(itemName) {
        return this.STATE[itemName];
    };

    this.getSavedItems = function getSavedItems() {
        return this.STATE;
    };

    // this.fillPlaceholders = function (str) {
    //     return fillCommonPlaceholders(fillItemsPlaceHolders(str, this.getSavedItems()))
    // }

    this.fillItemsPlaceHolders = function fillItemsPlaceHolders(str) {
        // parse all placeholders like '<User: First Name>'
        const matches = (str).match(/<([^>^<]+?):([^>^<]+?)>/gm);
        if (!matches) {
            return str;
        }
        let resultStr = str;
        // parse item name and property in two regex group
        const r = new RegExp('<([^>^<]+?):([^>^<]+?)>');
        for (const ph of matches) {
            const found = r.exec(ph);
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
