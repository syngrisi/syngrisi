/**
 * Copyright (C) 2020 Exadel, Inc.
 * This code is licensed under the terms of a proprietary license. See License.txt in `exadel_license` folder.
 */

function focus() {
    browser.elementSendKeys(this.elementId, '');
}

browser.addCommand('focus', focus, true);

function jsHide() {
    try {
        return browser.execute('return arguments[0].style.opacity=0', this);
    } catch (err) {
        throw `Cannot hide element: '${this.selector}' via js`;
    }
}

browser.addCommand('jsHide', jsHide, true);

function jsAddClass(classname) {
    try {
        return browser.execute(`arguments[0].classList.add('${classname}')`, this);
    } catch (err) {
        throw `Cannot add class to element: '${this.selector}' via js`;
    }
}

browser.addCommand('jsAddClass', jsAddClass, true);

function jsGetLocation() {
    try {
        return browser.execute('console.log(arguments[0].getBoundingClientRect()); return { x: parseInt(arguments[0].getBoundingClientRect().left), y: parseInt(arguments[0].getBoundingClientRect().top) }', this);
    } catch (err) {
        throw `Cannot get element location: '${this.selector}' via js`;
    }
}

browser.addCommand('jsGetLocation', jsGetLocation, true);

function jsRemove() {
    try {
        return browser.execute('return arguments[0].style.display=\'none\'', this);
    } catch (err) {
        throw `Cannot remove element: '${this.selector}' via js`;
    }
}

browser.addCommand('jsRemove', jsRemove, true);

function jsClick() {
    try {
        browser.execute('return arguments[0].click()', this);
    } catch (err) {
        throw `Cannot click on element: '${this.selector}' via js`;
    }
}

browser.addCommand('jsClick', jsClick, true);

function jsScrollIntoView() {
    try {
        browser.execute('return arguments[0].scrollIntoView()', this);
    } catch (err) {
        throw `Cannot scroll to the element: '${this.selector}' via js`;
    }
}

browser.addCommand('jsScrollIntoView', jsScrollIntoView, true);

async function jsGetPixelRatio() {
    try {
        return parseFloat(await browser.execute('return window.devicePixelRatio', this)) || 1;
    } catch (err) {
        return 1;
    }
}

browser.addCommand('jsGetPixelRatio', jsGetPixelRatio, false);

async function jsScrollbars(state, margin) {
    try {
        if (state) {
            await browser.execute(`document.documentElement.style.overflow = '';`);
            if (margin !== undefined) {
                await browser.execute(`return document.body.style.marginRight = '${margin}px';`);
            }
            return Promise.resolve();
        }

        const scrollbarWidth = await browser.execute('return window.innerWidth-$(document).width()');
        const currentMargin = parseInt(await browser.execute('return document.body.style.marginRight.replace(\'px\', \'\')')) || 0;
        const newMargin = currentMargin + scrollbarWidth;
        await browser.execute(`document.body.style.marginRight = '${newMargin}px'; document.documentElement.style.overflow = 'hidden'; return`);
        return Promise.resolve(currentMargin);
    } catch (err) {
        throw `Cannot set scrollbars in: '${state}', error: '${err}'`;
    }
}

browser.addCommand('jsScrollbars', jsScrollbars, false);

function jsGetScrollPositionSync() {
    return browser.execute('return [window.pageXOffset, window.pageYOffset]');

    // return browser.execute(() => {
    //     if (typeof window.pageYOffset !== 'undefined') {
    //         console.log('Case: pageYOffset');
    //         return [
    //             window.pageXOffset,
    //             window.pageYOffset
    //         ];
    //     } else if (typeof document.documentElement.scrollTop !== 'undefined' && document.documentElement.scrollTop > 0) {
    //         return [
    //             document.documentElement.scrollLeft,
    //             document.documentElement.scrollTop
    //         ];
    //     } else if (typeof document.body.scrollTop !== 'undefined') {
    //         return [
    //             document.body.scrollLeft,
    //             document.body.scrollTop
    //         ];
    //     }
    //     return [0, 0];
    // })
}

browser.addCommand('jsGetScrollPositionSync', jsGetScrollPositionSync, false);

async function getScrollBarWidthJs() {
    try {
        return parseInt(await browser.execute('return window.innerWidth - document.body.clientWidth;'));
    } catch (err) {
        throw `Cannot get scrollbar height`;
    }
}

browser.addCommand('getScrollBarWidthJs', getScrollBarWidthJs);

function jsSetAttribute(name, value) {
    try {
        browser.execute((el, name, value) => {

            el.setAttribute(name, value);
        }, this, name, value);
    } catch (err) {
        throw `Cannot set Attribute for element: '${this.selector}' via js, error: '${err}'`;
    }
}

browser.addCommand('jsSetAttribute', jsSetAttribute, true);

function jsSetStyle(name, value) {
    try {
        browser.execute((el, name, value) => {
            el.style[name] = value;
        }, this, name, value);
    } catch (err) {
        throw `Cannot set style Attribute for element: '${this.selector}' via js, error: '${err}'`;
    }
}

browser.addCommand('jsSetStyle', jsSetStyle, true);

const jsStopEvent = function jsStopEvent(eventName) {
    try {
        browser.execute((el, eventName) => {

            function stopEvent(ev) {
                ev.stopPropagation();
                console.log(`event propagation halted for: '${ev.type}', '${ev.target.localName}.${ev.target.classList}'`);
            }

            el.addEventListener(eventName, stopEvent, false);
        }, this, eventName);
    } catch (err) {
        throw `Cannot stop Event for element: '${this.selector}' via js, error: '${err}'`;
    }
};

browser.addCommand('jsStopEvent', jsStopEvent, true);

function jsStop(ms) {
    try {
        browser.executeAsync((ms, done) => {
            setTimeout(() => {
                window.stop();
                done();
            }, ms);

        }, ms);
    } catch (err) {
        throw `Cannot stop loading via js, error: '${err}'`;
    }
}

browser.addCommand('jsStop', jsStop);

function jsGetText() {
    try {
        return browser.execute((el) => {
            return arguments[0].innerText;
        }, this);
    } catch (err) {
        throw `Cannot get text for element: '${this.selector}' via js, error: '${err}'`;
    }
}

browser.addCommand('jsGetText', jsGetText, true);

function jsGetAttribute(attrName) {
    try {
        return browser.execute((el, attrName) => {
            return arguments[0].getAttribute(attrName);
        }, this, attrName);
    } catch (err) {
        throw `Cannot get attribute: '${attrName}' on element: '${this.selector}' via js, error: '${err}'`;
    }
}

browser.addCommand('jsGetAttribute', jsGetAttribute, true);

function jsSendMouseEvent(eventName) {
    try {
        // browser.pause(100);
        browser.execute((el, eventName) => {
            const evObj = document.createEvent('MouseEvents');
            evObj.initMouseEvent(eventName, true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            el.dispatchEvent(evObj, { bubbles: true });
        }, this, eventName);
    } catch (err) {
        throw `Cannot send event: '${eventName}' on element: '${this.selector}' via js, error: '${err}'`;
    }
}

browser.addCommand('jsSendMouseEvent', jsSendMouseEvent, true);

function jsValue() {
    try {
        return browser.execute('return arguments[0].value', this);
    } catch (err) {
        throw `Cannot get value for element: '${this.selector}' via js`;
    }
}

browser.addCommand('jsValue', jsValue, true);
