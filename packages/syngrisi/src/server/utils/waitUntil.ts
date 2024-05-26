export const waitUntil = async (cb: () => Promise<boolean>, attempts: number = 5, interval: number = 700): Promise<boolean> => {
    let result = false;
    let iteration = 0;
    while (result === false) {
        result = await cb();
        await new Promise((r) => setTimeout(r, interval));
        iteration += 1;

        if (iteration > attempts) {
            result = true;
        }
    }
    return result;
};
