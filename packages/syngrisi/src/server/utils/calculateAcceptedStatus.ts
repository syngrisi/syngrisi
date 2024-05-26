/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check } from '../models';

export const calculateAcceptedStatus = async function calculateAcceptedStatus(testId: any): Promise<string> {
    const checksInTest: any[] = await Check.find({ test: testId });
    const statuses: any[] = checksInTest.map((x: any) => x.markedAs);
    if (statuses.length < 1) {
        return 'Unaccepted';
    }
    let testCalculatedStatus: string = 'Unaccepted';
    if (statuses.some((x: any) => x === 'accepted')) {
        testCalculatedStatus = 'Partially';
    }
    if (statuses.every((x: any) => x === 'accepted')) {
        testCalculatedStatus = 'Accepted';
    }
    // console.log({ testCalculatedStatus });
    return testCalculatedStatus;
};
