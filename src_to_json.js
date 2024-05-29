const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outputDir = './export_gpt_codebase';

function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-z0-9.]/gi, '_');
}

function getFirstQuotedString(output) {
    const match = output.match(/"([^"]*)"/g);
    console.log({ match });
    return match.length > 0 ? match[0].replace(/"/g, '') : 'unknown';
}

function getCurrentPackageName(filePath) {
    // // Ensure we have the directory path, not the file path
    // let directory = filePath;
    // console.log(directory)
    // if (fs.statSync(filePath).isFile()) {
    //     directory = path.dirname(filePath);
    // }
    //
    // // Execute npm list in the directory of the file
    // const result = execSync(`npm list --depth=-1 --json`, { cwd: directory, encoding: 'utf-8' });
    // const jsonResult = JSON.parse(result);
    // return jsonResult.name;

    // Ensure we have the directory path, not the file path
    let directory = filePath;
    console.log('❤️', directory);
    if (fs.statSync(filePath)
        .isFile()) {
        directory = path.dirname(filePath);
    }

    // Execute npm list in the directory of the file
    const result = execSync(`npm pkg get name`, {
        cwd: directory,
        encoding: 'utf-8'
    });
    // const result = execSync(`npm pkg get`, { cwd: directory, encoding: 'utf-8' });
    // const result = execSync(`npm view . --json`, { cwd: directory });

    console.log('🤡🤡🤡🤡', result.toString());

    let name = getFirstQuotedString(result);
    console.log(name);
    return name;
    // const jsonResult = JSON.parse(result);
    // return jsonResult.name;
}

function convertToJson(inputPaths) {
    const fileTypes = ['.js', '.ts', '.tsx', '.md', '.json', '.feature'];
    let filesContent = {};
    inputPaths = typeof inputPaths === 'string' ? [inputPaths] : inputPaths;

    inputPaths.forEach(inputPath => {
        const basePath = path.join(__dirname, inputPath);
        const packageName = getCurrentPackageName(basePath);

        function readFilesFromDirectory(directory) {
            fs.readdirSync(directory)
                .forEach(file => {
                    const absolutePath = path.join(directory, file);
                    if (fs.statSync(absolutePath)
                        .isDirectory()) {
                        readFilesFromDirectory(absolutePath);
                    } else {
                        const extension = path.extname(absolutePath);
                        if (fileTypes.includes(extension)) {
                            const relativePath = path.relative(__dirname, absolutePath.replace(__dirname + path.sep, ''));
                            if (!filesContent[packageName]) {
                                filesContent[packageName] = {};
                            }
                            filesContent[packageName][relativePath] = fs.readFileSync(absolutePath, 'utf-8');
                            const relativeInputPath = path.join(inputPath, file);
                            // console.log('😀', path.join(relativePath))
                            // filesContent[packageName][relativePath] = fs.readFileSync(absolutePath, 'utf-8');
                            // filesContent[packageName][relativeInputPath] = fs.readFileSync(absolutePath, 'utf-8');
                        }
                    }
                });
        }

        if (fs.statSync(basePath)
            .isDirectory()) {
            readFilesFromDirectory(basePath);
        } else {
            const extension = path.extname(basePath);
            if (fileTypes.includes(extension)) {
                // const relativePath = basePath.replace(__dirname + path.sep, '');

                const relativePath = path.relative(__dirname, basePath.replace(__dirname + path.sep, ''));
                console.log('😀', path.join(relativePath));

                filesContent[packageName] = filesContent[packageName] || {};
                filesContent[packageName][relativePath] = fs.readFileSync(basePath, 'utf-8');
            }
        }
    });

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const outputName = inputPaths.length === 1 ? sanitizeFileName(path.basename(inputPaths[0])) + '.json' : 'syngrisi-codebase.json';
    const outputPath = path.join(outputDir, outputName);

    fs.writeFileSync(outputPath, JSON.stringify(filesContent, null, 2), 'utf-8');
    console.log(`Content has been grouped by package and combined into ${outputPath}`);
}

const paths = [
    // 'packages/core-api/src',
    // 'packages/core-api/README.md',
    // 'packages/wdio-sdk/src',
    // 'packages/wdio-sdk/README.md',
    // 'packages/playwright-sdk/src',
    // 'packages/playwright-sdk/README.md',
    'packages/syngrisi/src/server',
    // 'packages/syngrisi/src/ui-app/admin',
    // 'packages/syngrisi/src/ui-app/auth',
    // 'packages/syngrisi/src/ui-app/index2',
    // 'packages/syngrisi/src/ui-app/shared',
    'packages/syngrisi/README.md',
    // 'packages/create-sy/src',
    // 'packages/create-sy/README.md',
    // 'packages/wdio-syngrisi-cucumber-service/src',
    // 'packages/wdio-syngrisi-cucumber-service/README.md',
    // '../syngrisi-cucumber-boilerplate/README.md',
    // '../syngrisi-cucumber-boilerplate/src/features/syngrisi/',

    // '../syngrisi-playwright-boilerplate/README.md',
    // '../syngrisi-playwright-boilerplate/tests/'
];

convertToJson(paths);

//
// // core API
// convertToJson('packages/core-api/src');
// convertToJson('packages/core-api/README.md');
// //
// // wdio-sdk
// convertToJson('packages/wdio-sdk/src');
// convertToJson('packages/wdio-sdk/README.md');
//
// // playwright-sdk
// convertToJson('packages/playwright-sdk/src');
// convertToJson('packages/playwright-sdk/README.md');
//
// // syngrisi-server
// convertToJson('packages/syngrisi/src/server');
// convertToJson('packages/syngrisi/README.md');
//
// // create-sy
// convertToJson('packages/create-sy/src');
// convertToJson('packages/create-sy/README.md');
//
// // wdio-syngrisi-cucumber-service
// convertToJson('packages/wdio-syngrisi-cucumber-service/src');
// convertToJson('packages/wdio-syngrisi-cucumber-service/README.md');



