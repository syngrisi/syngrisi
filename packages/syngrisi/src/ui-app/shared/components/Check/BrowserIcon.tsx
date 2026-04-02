/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
    SiFirefox,
    SiGooglechrome,
    SiSafari,
} from 'react-icons/si';
import { FaSafari } from 'react-icons/fa';
import { FiChrome } from 'react-icons/fi';
import { IconBrandEdge, IconQuestionMark, IconBrandVisualStudio, IconWorldWww } from '@tabler/icons-react';

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
        msedge: IconBrandEdge,
        Msedge: IconBrandEdge,
        Safari: SiSafari,
        safari: SiSafari,
        webkit: FaSafari,
        'internet explorer': IconWorldWww,
        vscode: IconBrandVisualStudio,
        VSCode: IconBrandVisualStudio,
    } as { [key: string]: any };
    return map[key] || IconQuestionMark;
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
