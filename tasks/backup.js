/* eslint-disable no-console */
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { config } = require('../config');

const backupFolder = config.backupsFolder;
if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder, { recursive: true });
}

console.log('Please be sure that \'mongodump\', \'mongorestore\' and \'rsync\' tools are present in your system.');
const currDate = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: 'numeric' })
    .replace(/[/]/gm, '_');
const backupSubFolder = `${currDate}_${Date.now()}`;

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
    .then(async (answers) => {
        const { confirm } = answers;

        if (!confirm) return;

        const fullBackupPath = path.join(backupFolder, answers.folder);

        if (fs.existsSync(fullBackupPath)) {
            console.log('The folder is already exists, please enter another folder ');
            return;
        }
        fs.mkdirSync(fullBackupPath, { recursive: true });
        const destDatabasePath = path.join(fullBackupPath, 'database');
        fs.mkdirSync(destDatabasePath, { recursive: true });

        const destImagesPath = path.join(fullBackupPath, 'images');
        fs.mkdirSync(fullBackupPath, { recursive: true });

        console.log('Backup the Database');
        const dbDumpResult = execSync(`mongodump --uri=${answers.connectionString} --gzip --out ${destDatabasePath}`).toString();
        console.log(dbDumpResult);

        console.log('Backup the Images');
        const imagesBackupResult = execSync(`rsync -vah --progress ${answers.imagesPath} ${destImagesPath}`)
            .toString('utf8');
        console.log(imagesBackupResult);
    })
    .catch((e) => {
        if (e.isTtyError) {
            console.log('cannot render the menu on this environment', e);
        } else {
            console.log(e);
        }
    });
