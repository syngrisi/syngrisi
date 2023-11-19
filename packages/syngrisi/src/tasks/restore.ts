/* eslint-disable no-console */
import { input, confirm, select } from '@inquirer/prompts';
import * as fs from 'node:fs'
import * as path from 'node:path';
import { execSync } from 'child_process';
import { config } from '../../config';

const run = async () => {
    const backupFolder = config.backupsFolder;
    if (!fs.existsSync(backupFolder)) {
        fs.mkdirSync(backupFolder, { recursive: true });
    }

    console.log('Be sure that Application is down and \'mongodump\', \'mongorestore\' and \'rsync\' tools are present in your system.');

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

    const fullSourceDatabasePath = path.join(fullBackupPath, 'database');
    if (!fs.existsSync(fullSourceDatabasePath)) {
        console.log('The Source Database Folder is not exists, please select tha another folder');
        return;
    }

    const fullSourceImagesPath = path.join(fullBackupPath, 'images');
    if (!fs.existsSync(fullSourceImagesPath)) {
        console.log('The Source Images Folder is not exists, please select tha another folder');
        return;
    }

    if (!fs.existsSync(answers.destImagesSubFolder)) {
        console.log('The Destination Images Folder is not exists, please select tha another folder');
        return;
    }

    console.log('Remove the Destination Database');
    const removeDbResult = execSync(`mongosh '${answers.destConnectionString}' --eval "db.dropDatabase();"`)
        .toString();
    console.log(removeDbResult);

    console.log('Restore the Database');
    const restoreDbResult = execSync(`mongorestore --uri ${answers.destConnectionString} --gzip ${fullSourceDatabasePath}/*`)
        .toString();
    console.log(restoreDbResult);

    console.log('Clean the Destination Images Folder');
    // eslint-disable-next-line max-len
    const removeImagesResult = execSync(`ls ${answers.destImagesSubFolder};rm -rfv ${answers.destImagesSubFolder} && mkdir ${answers.destImagesSubFolder}`)
        .toString();
    console.log(removeImagesResult);

    console.log('Restore the Images');
    console.log({ fullSourceImagesPath });
    const restoreImagesResult = execSync(`rsync -vah --progress  ${fullSourceImagesPath}/ ${answers.destImagesSubFolder}`)
        .toString('utf8');
    console.log(restoreImagesResult);

    return '✅ Success'
}

run().then((result) => console.log(`operation complete: ${result}`));
