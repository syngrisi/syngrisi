/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from '../../models';
import adminData from '../../../seeds/admin.json';
import guestData from '../../../seeds/guest.json';
import log from "../logger";

const logOpts = {
    scope: 'on_start',
    msgType: 'SETUP',
};

export async function createBasicUsers(): Promise<void> {
    const defAdmin = await User.findOne({ username: 'Administrator' }).exec();
    const defGuest = await User.findOne({ username: 'Guest' }).exec();
    if (!defAdmin) {
        log.info('create the default Administrator', logOpts);
        const admin = await User.create(adminData);
        log.info(`administrator with id: '${admin._id}' was created`, logOpts);
    }
    if (!defGuest) {
        log.info('create the default Guest', logOpts);
        const guest = await User.create(guestData);
        log.info(`guest with id: '${guest._id}' was created`, logOpts);
    }
}
