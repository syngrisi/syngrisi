import checkClass from '../../src/support/check/checkClass';
import checkContainsAnyText from '../../src/support/check/checkContainsAnyText';
import checkIsEmpty from '../../src/support/check/checkIsEmpty';
import checkContainsText from '../../src/support/check/checkContainsText';
import checkCookieContent from '../../src/support/check/checkCookieContent';
import checkCookieExists from '../../src/support/check/checkCookieExists';
import checkDimension from '../../src/support/check/checkDimension';
import checkEqualsText from '../../src/support/check/checkEqualsText';
import checkFocus from '../../src/support/check/checkFocus';
import checkInURLPath from '../../src/support/check/checkInURLPath';
import checkIsOpenedInNewWindow from
        '../../src/support/check/checkIsOpenedInNewWindow';
import checkModal from '../../src/support/check/checkModal';
import checkModalText from '../../src/support/check/checkModalText';
import checkNewWindow from '../../src/support/check/checkNewWindow';
import checkOffset from '../../src/support/check/checkOffset';
import checkProperty from '../../src/support/check/checkProperty';
import checkFontProperty from '../../src/support/check/checkFontProperty';
import checkSelected from '../../src/support/check/checkSelected';
import checkTitle from '../../src/support/check/checkTitle';
import checkTitleContains from '../../src/support/check/checkTitleContains';
import checkURL from '../../src/support/check/checkURL';
import checkURLPath from '../../src/support/check/checkURLPath';
import checkWithinViewport from '../../src/support/check/checkWithinViewport';
import compareText from '../../src/support/check/compareText';
import isEnabled from '../../src/support/check/isEnabled';
import isExisting from '../../src/support/check/isExisting';
import isVisible from '../../src/support/check/isDisplayed';
import waitFor from '../../src/support/action/waitFor';
import waitForVisible from '../../src/support/action/waitForDisplayed';
import checkIfElementExists from '../../src/support/lib/checkIfElementExists';

const {Then} = require('cucumber');

Then(
    /^I expect that the title is( not)* "([^"]*)?"$/,
    checkTitle
);

Then(
    /^I expect that the title( not)* contains "([^"]*)?"$/,
    checkTitleContains
);

Then(
    /^I expect that element "([^"]*)?" does appear exactly "([^"]*)?" times$/,
    function (selector, times) {
        expect($$(selector).length).toBe(parseInt(times));
    }
    // checkIfElementExists
);

Then(
    /^I expect that element "([^"]*)?" is( not)* displayed$/,
    isVisible
);

Then(
    /^I expect that element "([^"]*)?" becomes( not)* displayed$/,
    waitForVisible
);

Then(
    /^I expect that element "([^"]*)?" is( not)* within the viewport$/,
    checkWithinViewport
);

Then(
    /^I expect that element "([^"]*)?" does( not)* exist$/,
    isExisting
);

Then(
    /^I expect that element "([^"]*)?"( not)* contains the same text as element "([^"]*)?"$/,
    compareText
);

Then(
    /^I expect that (button|element) "([^"]*)?"( not)* matches the text "([^"]*)?"$/,
    checkEqualsText
);

Then(
    /^I expect that (button|element|container) "([^"]*)?"( not)* contains the text "([^"]*)?"$/,
    checkContainsText
);

Then(
    /^I expect that (button|element) "([^"]*)?"( not)* contains any text$/,
    checkContainsAnyText
);

Then(
    /^I expect that (button|element) "([^"]*)?" is( not)* empty$/,
    checkIsEmpty
);

Then(
    /^I expect that the url is( not)* "([^"]*)?"$/,
    checkURL
);

Then(
    /^I expect that the path is( not)* "([^"]*)?"$/,
    checkURLPath
);

Then(
    /^I expect the url to( not)* contain "([^"]*)?"$/,
    checkInURLPath
);

Then(
    /^I expect that the( css)* attribute "([^"]*)?" from element "([^"]*)?" is( not)* "([^"]*)?"$/,
    checkProperty
);

Then(
    /^I expect that the font( css)* attribute "([^"]*)?" from element "([^"]*)?" is( not)* "([^"]*)?"$/,
    checkFontProperty
);

Then(
    /^I expect that checkbox "([^"]*)?" is( not)* checked$/,
    checkSelected
);

Then(
    /^I expect that element "([^"]*)?" is( not)* selected$/,
    checkSelected
);

Then(
    /^I expect that element "([^"]*)?" is( not)* enabled$/,
    isEnabled
);

Then(
    /^I expect that cookie "([^"]*)?"( not)* contains "([^"]*)?"$/,
    checkCookieContent
);

Then(
    /^I expect that cookie "([^"]*)?"( not)* exists$/,
    checkCookieExists
);

Then(
    /^I expect that element "([^"]*)?" is( not)* ([\d]+)px (broad|tall)$/,
    checkDimension
);

Then(
    /^I expect that element "([^"]*)?" is( not)* positioned at ([\d+.?\d*]+)px on the (x|y) axis$/,
    checkOffset
);

Then(
    /^I expect that element "([^"]*)?" (has|does not have) the class "([^"]*)?"$/,
    checkClass
);

Then(
    /^I expect a new (window|tab) has( not)* been opened$/,
    checkNewWindow
);

Then(
    /^I expect the url "([^"]*)?" is opened in a new (tab|window)$/,
    checkIsOpenedInNewWindow
);

Then(
    /^I expect that element "([^"]*)?" is( not)* focused$/,
    checkFocus
);

Then(
    /^I wait on element "([^"]*)?"(?: for (\d+)ms)*(?: to( not)* (be checked|be enabled|be selected|be displayed|contain a text|contain a value|exist))*$/,
    {
        wrapperOptions: {
            retry: 3,
        },
    },
    waitFor
);

Then(
    /^I expect that a (alertbox|confirmbox|prompt) is( not)* opened$/,
    checkModal
);

Then(
    /^I expect that a (alertbox|confirmbox|prompt)( not)* contains the text "([^"]*)?"$/,
    checkModalText
);
