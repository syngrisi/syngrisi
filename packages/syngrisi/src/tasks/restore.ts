/* eslint-disable no-console */
import { input, confirm, select } from '@inquirer/prompts';
import * as fs from 'node:fs'
import * as path from 'node:path';
import { config } from '../server/config';
import { restoreDatabaseBackupArchive, restoreScreenshotsArchive } from './lib/dataBackupRestore';

const run = async () => {
    const backupFolder = config.backupsFolder;
    if (!fs.existsSync(backupFolder)) {
        fs.mkdirSync(backupFolder, { recursive: true });
    }

    console.log('Be sure that application is down before restoring data.');

    const backupsFolders = fs.readdirSync(backupFolder, { withFileTypes: true })
        .filter((x) => x.isDirectory())
        .map((x) => ({ name: x.name, value: x.name }));

    const answers = {
        backupSubFolder: await select({ message: 'Enter the Backup Folder name Filename', choices: backupsFolders }),
        destConnectionString: await input({ message: 'Enter the Destination Database Connection String URI', default: config.connectionString }),
        destImagesSubFolder: await input({ message: 'Enter the Images Folder Path', default: config.defaultImagesPath }),
        confirm: await confirm({ message: '⚠️ Caution! All current Application Data will be removed, before the Restoring! Continue?', default: false }),
    };

    if (!answers.confirm) {
        return 'Skipped'
    }
    const fullBackupPath = path.join(backupFolder, answers.backupSubFolder);
    console.log({ fullBackupPath });

    const fullSourceDatabasePath = path.join(fullBackupPath, 'database.tar.gz');
    if (!fs.existsSync(fullSourceDatabasePath)) {
        console.log('The Source Database Folder is not exists, please select tha another folder');
        return;
    }

    const fullSourceImagesPath = path.join(fullBackupPath, 'images.tar.gz');
    if (!fs.existsSync(fullSourceImagesPath)) {
        console.log('The Source Images Folder is not exists, please select tha another folder');
        return;
    }

    if (!fs.existsSync(answers.destImagesSubFolder)) {
        console.log('The Destination Images Folder is not exists, please select tha another folder');
        return;
    }

    console.log('Restore the Database');
    await restoreDatabaseBackupArchive(answers.destConnectionString, fullSourceDatabasePath);
    console.log('Database restore completed');

    console.log('Restore the Images');
    await restoreScreenshotsArchive(fullSourceImagesPath, answers.destImagesSubFolder, { skipExisting: false });
    console.log('Images restore completed');

    return '✅ Success'
}

run().then((result) => console.log(`operation complete: ${result}`));
