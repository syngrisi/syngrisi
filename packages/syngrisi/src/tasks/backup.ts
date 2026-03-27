import { input, confirm } from '@inquirer/prompts';
import * as fs from 'node:fs'
import * as path from 'node:path';
import { config } from '../server/config';
import { createDatabaseBackupArchive, createScreenshotsArchive } from './lib/dataBackupRestore';

const run = async () => {
    const backupFolder: string = config.backupsFolder;
    if (!fs.existsSync(backupFolder)) {
        fs.mkdirSync(backupFolder, { recursive: true });
    }

    const currDate: string = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: 'numeric' })
        .replace(/[/]/gm, '_');
    const backupSubFolder: string = `${currDate}_${Date.now()}`;

    const answers = {
        folder: await input({ message: 'Enter the Backup Folder name Filename', default: backupSubFolder }),
        connectionString: await input({ message: 'Enter the Database Connection String URI', default: config.connectionString }),
        imagesPath: await input({ message: 'Enter the Images Folder Path', default: config.defaultImagesPath }),
        confirm: await confirm({ message: 'Continue?' }),
    };

    if (!answers.confirm) {
        return "Skipped"
    }

    const fullBackupPath: string = path.join(backupFolder, answers.folder);

    if (fs.existsSync(fullBackupPath)) {
        console.log('The folder is already exists, please enter another folder ');
        return;
    }
    fs.mkdirSync(fullBackupPath, { recursive: true });
    const destDatabasePath: string = path.join(fullBackupPath, 'database.tar.gz');
    const destImagesPath: string = path.join(fullBackupPath, 'images.tar.gz');

    console.log('Backup the Database');
    await createDatabaseBackupArchive(answers.connectionString, destDatabasePath);
    console.log(`Database archive created: ${destDatabasePath}`);

    console.log('Backup Images');
    await createScreenshotsArchive(answers.imagesPath, destImagesPath);
    console.log(`Screenshots archive created: ${destImagesPath}`);
    return '✅ Success'
}

run().then((result) => console.log(`operation complete: ${result}`));
