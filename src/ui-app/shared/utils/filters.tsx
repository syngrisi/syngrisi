import { escapeRegExp } from './utils';

export function generateItemFilter(label: string, operator: string, value: string) {
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
