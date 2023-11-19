import { input, confirm } from '@inquirer/prompts';
import * as fs from 'node:fs'
import * as path from 'node:path';
import { execSync } from 'child_process';
import { config } from '../../config';

const run = async () => {
    const backupFolder: string = config.backupsFolder;
    if (!fs.existsSync(backupFolder)) {
        fs.mkdirSync(backupFolder, { recursive: true });
    }

    console.log('Please be sure that \'mongodump\', \'mongorestore\' and \'rsync\' tools are present in your system.');
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
    const destDatabasePath: string = path.join(fullBackupPath, 'database');
    fs.mkdirSync(destDatabasePath, { recursive: true });

    const destImagesPath: string = path.join(fullBackupPath, 'images');
    fs.mkdirSync(fullBackupPath, { recursive: true });

    console.log('Backup the Database');
    const dbDumpResult: string = execSync(`mongodump --uri=${answers.connectionString} --gzip --out ${destDatabasePath}`).toString();
    console.log(dbDumpResult);

    console.log('Backup Images');
    const imagesBackupResult: string = execSync(`rsync -vah --progress ${answers.imagesPath} ${destImagesPath}`)
        .toString('utf8');
    console.log(imagesBackupResult);
    return '✅ Success'
}

run().then((result) => console.log(`operation complete: ${result}`));
