import { Given } from 'cucumber';

import checkContainsAnyText from '../src/support/check/checkContainsAnyText';
import checkIsEmpty from '../src/support/check/checkIsEmpty';
import checkContainsText from '../src/support/check/checkContainsText';
import checkCookieContent from '../src/support/check/checkCookieContent';
import checkCookieExists from '../src/support/check/checkCookieExists';
import checkDimension from '../src/support/check/checkDimension';
import checkElementExists from '../src/support/check/checkElementExists';
import checkEqualsText from '../src/support/check/checkEqualsText';
import checkModal from '../src/support/check/checkModal';
import checkOffset from '../src/support/check/checkOffset';
import checkProperty from '../src/support/check/checkProperty';
import checkSelected from '../src/support/check/checkSelected';
import checkTitle from '../src/support/check/checkTitle';
import checkUrl from '../src/support/check/checkURL';
import closeAllButFirstTab from '../src/support/action/closeAllButFirstTab';
import compareText from '../src/support/check/compareText';
import isEnabled from '../src/support/check/isEnabled';
import isDisplayed from '../src/support/check/isDisplayed';
import openWebsite from '../src/support/action/openWebsite';
import setWindowSize from '../src/support/action/setWindowSize';

Given(
    /^I open the (url|site) "([^"]*)?"$/,
    openWebsite
);

Given(
    /^the element "([^"]*)?" is( not)* displayed$/,
    isDisplayed
);

Given(
    /^the element "([^"]*)?" is( not)* enabled$/,
    isEnabled
);

Given(
    /^the element "([^"]*)?" is( not)* selected$/,
    checkSelected
);

Given(
    /^the checkbox "([^"]*)?" is( not)* checked$/,
    checkSelected
);

Given(
    /^there is (an|no) element "([^"]*)?" on the page$/,
    checkElementExists
);

Given(
    /^the title is( not)* "([^"]*)?"$/,
    checkTitle
);

Given(
    /^the element "([^"]*)?" contains( not)* the same text as element "([^"]*)?"$/,
    compareText
);

Given(
    /^the (button|element) "([^"]*)?"( not)* matches the text "([^"]*)?"$/,
    checkEqualsText
);

Given(
    /^the (button|element|container) "([^"]*)?"( not)* contains the text "([^"]*)?"$/,
    checkContainsText
);

Given(
    /^the (button|element) "([^"]*)?"( not)* contains any text$/,
    checkContainsAnyText
);

Given(
    /^the (button|element) "([^"]*)?" is( not)* empty$/,
    checkIsEmpty
);

Given(
    /^the page url is( not)* "([^"]*)?"$/,
    checkUrl
);

Given(
    /^the( css)* attribute "([^"]*)?" from element "([^"]*)?" is( not)* "([^"]*)?"$/,
    checkProperty
);

Given(
    /^the cookie "([^"]*)?" contains( not)* the value "([^"]*)?"$/,
    checkCookieContent
);

Given(
    /^the cookie "([^"]*)?" does( not)* exist$/,
    checkCookieExists
);

Given(
    /^the element "([^"]*)?" is( not)* ([\d]+)px (broad|tall)$/,
    checkDimension
);

Given(
    /^the element "([^"]*)?" is( not)* positioned at ([\d]+)px on the (x|y) axis$/,
    checkOffset
);

Given(
    /^I have a screen that is ([\d]+) by ([\d]+) pixels$/,
    setWindowSize
);

Given(
    /^I have closed all but the first (window|tab)$/,
    closeAllButFirstTab
);

Given(
    /^a (alertbox|confirmbox|prompt) is( not)* opened$/,
    checkModal
);
