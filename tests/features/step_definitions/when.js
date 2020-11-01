import clearInputField from '../../src/support/action/clearInputField';
import clickElement from '../../src/support/action/clickElement';
import closeLastOpenedWindow from '../../src/support/action/closeLastOpenedWindow';
import deleteCookies from '../../src/support/action/deleteCookies';
import dragElement from '../../src/support/action/dragElement';
import focusLastOpenedWindow from '../../src/support/action/focusLastOpenedWindow';
import handleModal from '../../src/support/action/handleModal';
import moveTo from '../../src/support/action/moveTo';
import pause from '../../src/support/action/pause';
import pressButton from '../../src/support/action/pressButton';
import scroll from '../../src/support/action/scroll';
import selectOption from '../../src/support/action/selectOption';
import selectOptionByIndex from '../../src/support/action/selectOptionByIndex';
import setCookie from '../../src/support/action/setCookie';
import setInputField from '../../src/support/action/setInputField';
import setPromptText from '../../src/support/action/setPromptText';

const { When } = require('cucumber');

When(
    /^I (click|doubleclick) on the (link|button|element) "([^"]*)?"$/,
    clickElement
);

When(
    /^I (add|set) "([^"]*)?" to the inputfield "([^"]*)?"$/,
    setInputField
);

When(
    /^I clear the inputfield "([^"]*)?"$/,
    clearInputField
);

When(
    /^I drag element "([^"]*)?" to element "([^"]*)?"$/,
    dragElement
);

When(
    /^I pause for (\d+)ms$/,
    pause
);

When(
    /^I set a cookie "([^"]*)?" with the content "([^"]*)?"$/,
    setCookie
);

When(
    /^I delete the cookie "([^"]*)?"$/,
    deleteCookies
);

When(
    /^I press "([^"]*)?"$/,
    pressButton
);

When(
    /^I (accept|dismiss) the (alertbox|confirmbox|prompt)$/,
    handleModal
);

When(
    /^I enter "([^"]*)?" into the prompt$/,
    setPromptText
);

When(
    /^I scroll to element "([^"]*)?"$/,
    scroll
);

When(
    /^I close the last opened (window|tab)$/,
    closeLastOpenedWindow
);

When(
    /^I focus the last opened (window|tab)$/,
    focusLastOpenedWindow
);

When(
    /^I select the (\d+)(st|nd|rd|th) option for element "([^"]*)?"$/,
    selectOptionByIndex
);

When(
    /^I select the option with the (name|value|text) "([^"]*)?" for element "([^"]*)?"$/,
    selectOption
);

When(
    /^I move to element "([^"]*)?"(?: with an offset of (\d+),(\d+))*$/,
    moveTo
);
