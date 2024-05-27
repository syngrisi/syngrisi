/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from '../../models';
import adminData from '../../../seeds/admin.json';
import guestData from '../../../seeds/guest.json';
import log2 from "../../lib/logger2";

const fileLogMeta = {
    scope: 'on_start',
    msgType: 'SETUP',
};

export async function createBasicUsers(): Promise<void> {
    const defAdmin = await User.findOne({ username: 'Administrator' }).exec();
    const defGuest = await User.findOne({ username: 'Guest' }).exec();
    if (!defAdmin) {
        log2.info('create the default Administrator', fileLogMeta);
        const admin = await User.create(adminData);
        log2.info(`administrator with id: '${admin._id}' was created`, fileLogMeta);
    }
    if (!defGuest) {
        log2.info('create the default Guest', fileLogMeta);
        const guest = await User.create(guestData);
        log2.info(`guest with id: '${guest._id}' was created`, fileLogMeta);
    }
}
