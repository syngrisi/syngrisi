/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
    SiFirefox,
    SiGooglechrome,
    SiInternetexplorer,
    SiMicrosoftedge,
    SiSafari,
} from 'react-icons/si';
import { TbQuestionMark } from 'react-icons/tb';

interface Props {
    browser: string
    size: number
    color?: string
}

const browserIconMap = (key: string) => {
    const map = {
        chrome: SiGooglechrome,
        'chrome [HEADLESS]': SiGooglechrome,
        Chrome: SiGooglechrome,
        firefox: SiFirefox,
        Firefox: SiFirefox,
        msedge: SiMicrosoftedge,
        Msedge: SiMicrosoftedge,
        Safari: SiSafari,
        safari: SiSafari,
        'internet explorer': SiInternetexplorer,
    } as { [key: string]: any };
    return map[key] || TbQuestionMark;
};

export function BrowserIcon({ browser, size = 24, color = '', ...rest }: Props) {
    const BrowIcon = browserIconMap(browser);

    return (
        <BrowIcon
            size={size}
            title={browser}
            color={color}
            {...rest}
        />
    );
}
