export function generateItemFilter(label: string, operator: string, value: string) {
    function escapeRegExp(text: string) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    const transform: any = {
        eq: () => ({ $eq: value }),
        ne: () => ({ $ne: value }),
        lt: () => ({ $lt: value }),
        gt: () => ({ $gt: value }),
        contains: () => ({ $regex: escapeRegExp(value), $options: 'im' }),
        not_contains: () => ({ $regex: `^((?!${escapeRegExp(value)}).)*$`, $options: 'im' }),
    };

    return { [label]: transform[operator]() };
}
