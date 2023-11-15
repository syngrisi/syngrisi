import inquirer from 'inquirer';
import { input, confirm } from '@inquirer/prompts';
import * as fs from 'node:fs'
// import fs from 'fs';
import * as path from 'node:path';
import { execSync } from 'child_process';
import { config } from '../../config.js';

const backupFolder: string = config.backupsFolder;
if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder, { recursive: true });
}

console.log('Please be sure that \'mongodump\', \'mongorestore\' and \'rsync\' tools are present in your system.');
const currDate: string = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: 'numeric' })
    .replace(/[/]/gm, '_');
const backupSubFolder: string = `${currDate}_${Date.now()}`;

const answers: {
    firstName: string;
    allowEmail: boolean;
} = {
    firstName: await input({ message: 'What\'s your first name?' }),
    allowEmail: await confirm({ message: 'Do you allow us to send you email?' }),
};

console.log(answers.firstName);

inquirer
    .prompt([
        { type: 'string', name: 'folder', message: 'Enter the Backup Folder name Filename', default: backupSubFolder },
        {
            type: 'string',
            name: 'connectionString',
            message: 'Enter the Database Connection String URI',
            default: config.connectionString,
        },
        {
            type: 'string',
            name: 'imagesPath',
            message: 'Enter the Images Folder',
            default: config.defaultBaselinePath,
        },
        {
            type: 'string',
            name: 'confirm',
            message: 'Continue? (y/N)',
        },

    ])
    .then(async (answers: {
        folder: string;
        connectionString: string;
        imagesPath: string;
        confirm: string;
    }) => {
        const { confirm } = answers;

        if (!confirm) return;

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

        console.log('Backup the Images');
        const imagesBackupResult: string = execSync(`rsync -vah --progress ${answers.imagesPath} ${destImagesPath}`)
            .toString('utf8');
        console.log(imagesBackupResult);
    })
    .catch((e: any) => {
        if (e.isTtyError) {
            console.log('cannot render the menu on this environment', e);
        } else {
            console.log(e);
        }
    });
