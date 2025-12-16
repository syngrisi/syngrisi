const logger = require('@wdio/logger').default;
const log = logger('wdio-cucumber-viewport-logger-service');

module.exports.renderDebugMsg = function (browser, params) {
    browser.cucumberViewportMessages = browser.cucumberViewportMessages ? browser.cucumberViewportMessages : [];
    const numberOfSteps = params?.numberOfSteps ? (params?.numberOfSteps - 1) : 2;
    if (browser.cucumberViewportMessages && browser.cucumberViewportMessages.length > numberOfSteps) {
        browser.cucumberViewportMessages.shift();
    }

    browser.cucumberViewportMessages.push(params);

    function isAlertOpen() {
        try {
            browser.getAlertText();
        } catch (e) {
            if (e.toString().includes('no such alert')) {
                return false;
            }
        }
        return true
    }

    // if run some javascript in browser context - alert will be closed
    // therefore we don't render the message
    // it will be rendered on the next step
    if (isAlertOpen()) return;

    browser.execute((opts) => {
        if (!document.body) {
            log.warn('cannot see the document body');
            return;
        }

        const defaultStyles = {
            'accent-color': 'auto',
            'align-content': 'normal',
            'align-items': 'normal',
            'align-self': 'auto',
            'alignment-baseline': 'auto',
            'animation-delay': '0s',
            'animation-direction': 'normal',
            'animation-duration': '0s',
            'animation-fill-mode': 'none',
            'animation-iteration-count': '1',
            'animation-name': 'none',
            'animation-play-state': 'running',
            'animation-timing-function': 'ease',
            'app-region': 'none',
            appearance: 'none',
            'backdrop-filter': 'none',
            'backface-visibility': 'visible',
            'background-attachment': 'scroll',
            'background-blend-mode': 'normal',
            'background-clip': 'border-box',
            // 'background-color': 'rgb(43, 43, 43)',
            'background-image': 'none',
            'background-origin': 'padding-box',
            'background-position': '0% 0%',
            'background-repeat': 'repeat',
            'background-size': 'auto',
            'baseline-shift': '0px',
            'block-size': '60px',
            // 'border-block-end-color': 'rgb(98, 100, 101)',
            'border-block-end-style': 'solid',
            'border-block-end-width': '3px',
            // 'border-block-start-color': 'rgb(98, 100, 101)',
            'border-block-start-style': 'solid',
            'border-block-start-width': '3px',
            // 'border-bottom-color': 'rgb(98, 100, 101)',
            'border-bottom-left-radius': '7px',
            'border-bottom-right-radius': '7px',
            'border-bottom-style': 'solid',
            'border-bottom-width': '3px',
            'border-collapse': 'separate',
            'border-end-end-radius': '7px',
            'border-end-start-radius': '7px',
            'border-image-outset': '0',
            'border-image-repeat': 'stretch',
            'border-image-slice': '100%',
            'border-image-source': 'none',
            'border-image-width': '1',
            // 'border-inline-end-color': 'rgb(98, 100, 101)',
            'border-inline-end-style': 'solid',
            'border-inline-end-width': '3px',
            // 'border-inline-start-color': 'rgb(98, 100, 101)',
            'border-inline-start-style': 'solid',
            'border-inline-start-width': '3px',
            // 'border-left-color': 'rgb(98, 100, 101)',
            'border-left-style': 'solid',
            'border-left-width': '3px',
            // 'border-right-color': 'rgb(98, 100, 101)',
            'border-right-style': 'solid',
            'border-right-width': '3px',
            'border-start-end-radius': '7px',
            'border-start-start-radius': '7px',
            // 'border-top-color': 'rgb(98, 100, 101)',
            'border-top-left-radius': '7px',
            'border-top-right-radius': '7px',
            'border-top-style': 'solid',
            'border-top-width': '3px',
            bottom: '3px',
            'box-shadow': 'none',
            'box-sizing': 'content-box',
            'break-after': 'auto',
            'break-before': 'auto',
            'break-inside': 'auto',
            'buffered-rendering': 'auto',
            'caption-side': 'top',
            // 'caret-color': 'rgb(152, 164, 177)',
            clear: 'none',
            clip: 'auto',
            'clip-path': 'none',
            'clip-rule': 'nonzero',
            // color: 'rgb(152, 164, 177)',
            'color-interpolation': 'srgb',
            'color-interpolation-filters': 'linearrgb',
            'color-rendering': 'auto',
            'column-count': 'auto',
            'column-gap': 'normal',
            // 'column-rule-color': 'rgb(152, 164, 177)',
            'column-rule-style': 'none',
            'column-rule-width': '0px',
            'column-span': 'none',
            'column-width': 'auto',
            'contain-intrinsic-block-size': 'none',
            'contain-intrinsic-height': 'none',
            'contain-intrinsic-inline-size': 'none',
            'contain-intrinsic-size': 'none',
            'contain-intrinsic-width': 'none',
            content: 'normal',
            cursor: 'auto',
            cx: '0px',
            cy: '0px',
            d: 'none',
            direction: 'ltr',
            display: 'block',
            'dominant-baseline': 'auto',
            'empty-cells': 'show',
            fill: 'rgb(0, 0, 0)',
            'fill-opacity': '1',
            'fill-rule': 'nonzero',
            filter: 'none',
            'flex-basis': 'auto',
            'flex-direction': 'row',
            'flex-grow': '0',
            'flex-shrink': '1',
            'flex-wrap': 'nowrap',
            float: 'none',
            'flood-color': 'rgb(0, 0, 0)',
            'flood-opacity': '1',
            'font-family': 'Courier New',
            'font-kerning': 'auto',
            'font-optical-sizing': 'auto',
            'font-palette': 'normal',
            'font-size': '20px',
            'font-stretch': '100%',
            'font-style': 'normal',
            'font-synthesis-small-caps': 'auto',
            'font-synthesis-style': 'auto',
            'font-synthesis-weight': 'auto',
            'font-variant': 'normal',
            'font-variant-caps': 'normal',
            'font-variant-east-asian': 'normal',
            'font-variant-ligatures': 'normal',
            'font-variant-numeric': 'normal',
            'font-weight': '700',
            'grid-auto-columns': 'auto',
            'grid-auto-flow': 'row',
            'grid-auto-rows': 'auto',
            'grid-column-end': 'auto',
            'grid-column-start': 'auto',
            'grid-row-end': 'auto',
            'grid-row-start': 'auto',
            'grid-template-areas': 'none',
            'grid-template-columns': 'none',
            'grid-template-rows': 'none',
            height: '60px',
            hyphens: 'manual',
            'image-orientation': 'from-image',
            'image-rendering': 'auto',
            'inline-size': '683.055px',
            'inset-block-end': '3px',
            'inset-block-start': 'auto',
            'inset-inline-end': 'auto',
            'inset-inline-start': '23.6875px',
            isolation: 'auto',
            'justify-content': 'normal',
            'justify-items': 'normal',
            'justify-self': 'auto',
            left: '23.6875px',
            'letter-spacing': 'normal',
            // 'lighting-color': 'rgb(255, 255, 255)',
            'line-break': 'auto',
            'line-height': '2px',
            'list-style-image': 'none',
            'list-style-position': 'outside',
            'list-style-type': 'disc',
            'margin-block-end': '0px',
            'margin-block-start': '0px',
            'margin-bottom': '0px',
            'margin-inline-end': '0px',
            'margin-inline-start': '0px',
            'margin-left': '0px',
            'margin-right': '0px',
            'margin-top': '0px',
            'marker-end': 'none',
            'marker-mid': 'none',
            'marker-start': 'none',
            'mask-type': 'luminance',
            'max-block-size': 'none',
            'max-height': 'none',
            'max-inline-size': 'none',
            'max-width': 'none',
            'min-block-size': '0px',
            'min-height': '0px',
            'min-inline-size': '0px',
            'min-width': '0px',
            'mix-blend-mode': 'normal',
            'object-fit': 'fill',
            'object-position': '50% 50%',
            'offset-distance': '0px',
            'offset-path': 'none',
            'offset-rotate': 'auto 0deg',
            opacity: '0.9',
            order: '0',
            orphans: '2',
            // 'outline-color': 'rgb(152, 164, 177)',
            'outline-offset': '0px',
            'outline-style': 'none',
            'outline-width': '0px',
            'overflow-anchor': 'auto',
            'overflow-clip-margin': '0px',
            'overflow-wrap': 'normal',
            'overflow-x': 'visible',
            'overflow-y': 'visible',
            'overscroll-behavior-block': 'auto',
            'overscroll-behavior-inline': 'auto',
            'padding-block-end': '3px',
            'padding-block-start': '3px',
            'padding-bottom': '3px',
            'padding-inline-end': '10px',
            'padding-inline-start': '3px',
            'padding-left': '3px',
            'padding-right': '10px',
            'padding-top': '3px',
            'paint-order': 'normal',
            perspective: 'none',
            'perspective-origin': '351.023px 36px',
            'pointer-events': 'none',
            position: 'sticky',
            r: '0px',
            resize: 'none',
            right: 'auto',
            'row-gap': 'normal',
            'ruby-position': 'over',
            rx: 'auto',
            ry: 'auto',
            'scroll-behavior': 'auto',
            'scroll-margin-block-end': '0px',
            'scroll-margin-block-start': '0px',
            'scroll-margin-inline-end': '0px',
            'scroll-margin-inline-start': '0px',
            'scroll-padding-block-end': 'auto',
            'scroll-padding-block-start': 'auto',
            'scroll-padding-inline-end': 'auto',
            'scroll-padding-inline-start': 'auto',
            'scrollbar-gutter': 'auto',
            'shape-image-threshold': '0',
            'shape-margin': '0px',
            'shape-outside': 'none',
            'shape-rendering': 'auto',
            speak: 'normal',
            'stop-color': 'rgb(0, 0, 0)',
            'stop-opacity': '1',
            stroke: 'none',
            'stroke-dasharray': 'none',
            'stroke-dashoffset': '0px',
            'stroke-linecap': 'butt',
            'stroke-linejoin': 'miter',
            'stroke-miterlimit': '4',
            'stroke-opacity': '1',
            'stroke-width': '1px',
            'tab-size': '8',
            'table-layout': 'auto',
            'text-align': 'left',
            'text-align-last': 'auto',
            'text-anchor': 'start',
            // 'text-decoration': 'none solid rgb(152, 164, 177)',
            // 'text-decoration-color': 'rgb(152, 164, 177)',
            'text-decoration-line': 'none',
            'text-decoration-skip-ink': 'auto',
            'text-decoration-style': 'solid',
            // 'text-emphasis-color': 'rgb(152, 164, 177)',
            'text-emphasis-position': 'over',
            'text-emphasis-style': 'none',
            'text-indent': '0px',
            'text-overflow': 'clip',
            'text-rendering': 'auto',
            'text-shadow': 'none',
            'text-size-adjust': 'auto',
            'text-transform': 'none',
            'text-underline-position': 'auto',
            top: 'auto',
            'touch-action': 'auto',
            transform: 'none',
            'transform-origin': '351.027px 36px',
            'transform-style': 'flat',
            'transition-delay': '0s',
            'transition-duration': '0s',
            'transition-property': 'all',
            'transition-timing-function': 'ease',
            'unicode-bidi': 'normal',
            'user-select': 'auto',
            'vector-effect': 'none',
            'vertical-align': 'baseline',
            visibility: 'visible',
            'white-space': 'normal',
            widows: '2',
            width: '683.055px',
            'will-change': 'auto',
            'word-break': 'normal',
            'word-spacing': '0px',
            'writing-mode': 'horizontal-tb',
            x: '0px',
            y: '0px',
            'z-index': '100000',
            zoom: '1',
            '-webkit-border-horizontal-spacing': '0px',
            '-webkit-border-image': 'none',
            '-webkit-border-vertical-spacing': '0px',
            '-webkit-box-align': 'stretch',
            '-webkit-box-decoration-break': 'slice',
            '-webkit-box-direction': 'normal',
            '-webkit-box-flex': '0',
            '-webkit-box-ordinal-group': '1',
            '-webkit-box-orient': 'horizontal',
            '-webkit-box-pack': 'start',
            '-webkit-box-reflect': 'none',
            '-webkit-font-smoothing': 'auto',
            '-webkit-highlight': 'none',
            '-webkit-hyphenate-character': 'auto',
            '-webkit-line-break': 'auto',
            '-webkit-line-clamp': 'none',
            '-webkit-locale': 'auto',
            '-webkit-mask-box-image': 'none',
            '-webkit-mask-box-image-outset': '0',
            '-webkit-mask-box-image-repeat': 'stretch',
            '-webkit-mask-box-image-slice': '0 fill',
            '-webkit-mask-box-image-source': 'none',
            '-webkit-mask-box-image-width': 'auto',
            '-webkit-mask-clip': 'border-box',
            '-webkit-mask-composite': 'source-over',
            '-webkit-mask-image': 'none',
            '-webkit-mask-origin': 'border-box',
            '-webkit-mask-position': '0% 0%',
            '-webkit-mask-repeat': 'repeat',
            '-webkit-mask-size': 'auto',
            '-webkit-print-color-adjust': 'economy',
            '-webkit-rtl-ordering': 'logical',
            // '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0.18)',
            '-webkit-text-combine': 'none',
            '-webkit-text-decorations-in-effect': 'none',
            // '-webkit-text-fill-color': 'rgb(152, 164, 177)',
            '-webkit-text-orientation': 'vertical-right',
            '-webkit-text-security': 'none',
            // '-webkit-text-stroke-color': 'rgb(152, 164, 177)',
            '-webkit-text-stroke-width': '0px',
            '-webkit-user-drag': 'auto',
            '-webkit-user-modify': 'read-only',
            '-webkit-writing-mode': 'horizontal-tb',
        };

        const wrapperStyles = {
            ...{
                width: '98%',
                height: `${(20 * (opts.messages.length + 1)).toString()}px`,
                position: 'fixed',
                bottom: '3px',
                left: '3px',
                zIndex: 100000,
                pointerEvents: 'none', // Make sure you can click 'through' the canvas

                backgroundColor: '#2b2b2b',
                paddingLeft: '3px',
                color: '#98a4b1',
                fontSize: '20px',
                opacity: '0.9',
                padding: '3px',
                lineHeight: '0.1',
                textAlign: 'left',
                fontFamily: 'Courier New',
                paddingRight: '10px',
                fontWeight: 'bold',
                border: '3px solid #626465',
                borderRadius: '7px',
                'white-space': 'nowrap',
                overflow: 'hidden',
                'line-height': '0.25em',
            },
            ...opts?.styles?.wrapper,
        };

        const keywordStyle = {
            ...{
                color: '#be7131',
            },
            ...opts?.styles?.keyword,
        };

        const stepStyle = {
            ...{
                marginTop: '8px',
                marginBottom: '8px',
                paddingTop: '5px',
                paddingBottom: '5px',
                display: 'block',
            },
            ...opts?.styles?.text,
        };

        const closeButtonStyle = {
            ...{
                display: 'block',
                position: 'absolute',
                right: '4px',
                top: '4px',
                cursor: 'pointer',
                border: 'solid',
                color: '#FF4046',
                'padding-top': '6px',
                'padding-bottom': '6px',
                'padding-left': '3px',
                'padding-right': '3px',
            },
            ...opts?.styles?.closeButton,
        }

        function setStyles(el, styles) {
            Object.keys(styles)
                .forEach((style) => {
                    el.style[style] = styles[style];
                });
        }

        const id = 'wdio-debug-msg';
        const oldWrapper = document.getElementById(id);

        const newWrapper = oldWrapper || document.createElement('wdio-debug-wrapper');
        newWrapper.id = id;
        newWrapper.innerHTML = '';

        const closeButton = document.createElement('close-logger');
        closeButton.innerHTML = 'x';
        // need to disable pointer-events style from wrapper to use the close button
        closeButton.addEventListener('click', () => {
            document.getElementsByTagName('wdio-debug-wrapper')[0].remove()
        })
        setStyles(closeButton, closeButtonStyle);
        newWrapper.appendChild(closeButton);

        if (!oldWrapper) document.body.appendChild(newWrapper);

        for (const msg of opts.messages) {
            const stepMessage = document.createElement('step-message');
            const gherkinKeyword = document.createElement('gherkin-keyword');
            if (msg.keyword) {
                gherkinKeyword.innerHTML = msg.keyword;
                setStyles(gherkinKeyword, keywordStyle);
            }
            stepMessage.appendChild(gherkinKeyword);
            stepMessage.innerHTML += msg.message.replace(/["]/g, '&apos;');
            newWrapper.appendChild(stepMessage);
            setStyles(stepMessage, stepStyle);
        }
        setStyles(newWrapper, defaultStyles);
        newWrapper.style.left = `${window.innerWidth - newWrapper.getBoundingClientRect().width - 3}px`;
        setStyles(newWrapper, wrapperStyles);
    }, { messages: browser.cucumberViewportMessages, styles: params?.styles });
};
