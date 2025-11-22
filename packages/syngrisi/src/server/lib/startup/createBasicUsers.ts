/* eslint-disable no-underscore-dangle */
import { User } from '@models';
import adminData from '../../../seeds/admin.json';
import guestData from '../../../seeds/guest.json';
import log from "@logger";

const logOpts = {
    scope: 'on_start',
    msgType: 'SETUP',
};

export async function createBasicUsers(): Promise<void> {
    const defAdmin = await User.findOne({ username: 'Administrator' }).exec();
    const defGuest = await User.findOne({ username: 'Guest' }).exec();
    if (!defAdmin) {
        log.info('create the default Administrator', logOpts);
        const admin = new User(adminData);
        await admin.setPassword(process.env.ADMIN_PASSWORD || 'Administrator');
        await admin.save();
        log.info(`administrator with id: '${admin._id}' was created`, logOpts);
    }
    if (!defGuest) {
        log.info('create the default Guest', logOpts);
        const guest = new User(guestData);
        await guest.setPassword(process.env.GUEST_PASSWORD || 'Guest');
        await guest.save();
        log.info(`guest with id: '${guest._id}' was created`, logOpts);
    }

    // Verify users exist after creation
    const adminCheck = await User.findOne({ username: 'Administrator' }).exec();
    const guestCheck = await User.findOne({ username: 'Guest' }).exec();
    log.info(`✓ Basic users verified - Administrator: ${!!adminCheck}, Guest: ${!!guestCheck}`, logOpts);
}
