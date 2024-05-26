const isJSON = (text: string | null): boolean => {
    if (!text) return false;

    const isValid = /^[\],:{}\s]*$/.test(
        text
            .replace(/\\["\\\/bfnrtu]/g, '@')
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
            .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
    );

    return isValid;
};

export default isJSON;
