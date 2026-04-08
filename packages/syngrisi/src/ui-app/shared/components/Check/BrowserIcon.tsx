/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
    IconBrandChrome,
    IconBrandEdge,
    IconBrandFirefox,
    IconBrandSafari,
    IconBrandVisualStudio,
    IconQuestionMark,
    IconWorldWww,
} from '@tabler/icons-react';

interface Props {
    browser: string
    size: number
    color?: string
}

const browserIconMap = (key: string) => {
    const map = {
        chrome: IconBrandChrome,
        chromium: IconBrandChrome,
        'chrome [HEADLESS]': IconBrandChrome,
        Chrome: IconBrandChrome,
        firefox: IconBrandFirefox,
        Firefox: IconBrandFirefox,
        msedge: IconBrandEdge,
        Msedge: IconBrandEdge,
        Safari: IconBrandSafari,
        safari: IconBrandSafari,
        webkit: IconBrandSafari,
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
