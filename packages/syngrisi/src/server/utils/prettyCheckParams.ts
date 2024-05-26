interface Result {
    domDump?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

const prettyCheckParams = (result: Result): string => {
    if (!result.domDump) {
        return JSON.stringify(result);
    }
    const dump = JSON.parse(result.domDump);
    const resObs = { ...result };
    delete resObs.domDump;
    resObs.domDump = `${JSON.stringify(dump).substr(0, 20)}... and about ${dump.length} items]`;
    return JSON.stringify(resObs);
};

export default prettyCheckParams;
