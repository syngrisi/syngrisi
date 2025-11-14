/* eslint-disable @typescript-eslint/no-explicit-any */
import { subDays, dateToISO8601 } from '@utils';
import { IOutputWriter } from '../lib/output-writer';
import { Log } from '../lib';

export interface RemoveOldLogsOptions {
    days: number;
    statistics: boolean;
}

/**
 * Remove old logs task
 * Removes logs that are older than specified days
 *
 * @param options - Task options
 * @param output - Output writer for streaming results
 */
export async function removeOldLogsTask(
    options: RemoveOldLogsOptions,
    output: IOutputWriter
): Promise<void> {
    try {
        const trashHoldDate = subDays(new Date(), options.days);
        const filter = { timestamp: { $lt: trashHoldDate } };
        const allLogsCountBefore = await Log.find({}).countDocuments();
        const oldLogsCount = await Log.find(filter).countDocuments();
        output.write(`- the count of all documents is: '${allLogsCountBefore}'\n`);
        output.write(`- the count of documents to be removed is: '${oldLogsCount}'\n`);

        if (!options.statistics) {
            output.write(`- will remove all logs older that: '${options.days}' days, '${dateToISO8601(trashHoldDate)}'\n`);
            await Log.deleteMany(filter);
            const allLogsCountAfter = await Log.find({}).countDocuments();
            output.write(`- the count of all documents now is: '${allLogsCountAfter}'\n`);
        }

        output.write('> Done');
    } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        output.write(errMsg);
        throw e;
    } finally {
        output.end();
    }
}
