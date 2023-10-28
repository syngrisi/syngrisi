/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
    SiFirefox,
    SiGooglechrome,
    SiInternetexplorer,
    SiMicrosoftedge,
    SiSafari,
} from 'react-icons/si';
// import {PiGoogleChromeLogoThin} from 'react-icons/pi'
import { TbQuestionMark } from 'react-icons/tb';
import { FaSafari, FiChrome } from 'react-icons/all';

interface Props {
    browser: string
    size: number
    color?: string
}

const browserIconMap = (key: string) => {
    const map = {
        chrome: SiGooglechrome,
        chromium: FiChrome,
        'chrome [HEADLESS]': SiGooglechrome,
        Chrome: SiGooglechrome,
        firefox: SiFirefox,
        Firefox: SiFirefox,
        msedge: SiMicrosoftedge,
        Msedge: SiMicrosoftedge,
        Safari: SiSafari,
        safari: SiSafari,
        webkit: FaSafari,
        'internet explorer': SiInternetexplorer,
    } as { [key: string]: any };
    return map[key] || TbQuestionMark;
};

export function BrowserIcon({ browser, size = 24, color = '', ...rest }: Props) {
    const BrowIcon = browserIconMap(browser);

    return (
        <BrowIcon
            style={{ width: size }}
            size={size}
            title={browser}
            color={color}
            {...rest}
        />
    );
}
