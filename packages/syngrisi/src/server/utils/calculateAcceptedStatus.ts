import { Check } from '@models';
import { Schema } from 'mongoose';


type statusType = 'Bug' | 'Accepted' | 'Unaccepted' | 'Partially';

export const calculateAcceptedStatus = async function calculateAcceptedStatus(testId: string | Schema.Types.ObjectId): Promise<statusType> {
    const checksInTest = await Check.find({ test: testId });
    const statuses = checksInTest.map((x) => x.markedAs);
    if (statuses.length < 1) {
        return 'Unaccepted';
    }
    let testCalculatedStatus: statusType = 'Unaccepted';
    if (statuses.some((x) => x === 'accepted')) {
        testCalculatedStatus = 'Partially';
    }
    if (statuses.every((x) => x === 'accepted')) {
        testCalculatedStatus = 'Accepted';
    }
    // console.log({ testCalculatedStatus });
    return testCalculatedStatus;
};
