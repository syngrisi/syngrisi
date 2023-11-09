const fs = require('fs');
const path = require('path');

function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-z0-9.]/gi, '_');
}

function convertToJson(inputPaths) {
    const filesContent = {};
    inputPaths = typeof inputPaths === 'string' ? [inputPaths] : inputPaths;

    inputPaths.forEach(inputPath => {
        const basePath = path.join(__dirname, inputPath);

        function readFilesFromDirectory(directory) {
            fs.readdirSync(directory).forEach(file => {
                const absolutePath = path.join(directory, file);
                if (fs.statSync(absolutePath).isDirectory()) {
                    readFilesFromDirectory(absolutePath);
                } else {
                    const extension = path.extname(absolutePath);
                    if (['.js', '.ts', '.md'].includes(extension)) {
                        filesContent[absolutePath.replace(__dirname + path.sep, '')] = fs.readFileSync(absolutePath, 'utf-8');
                    }
                }
            });
        }

        if (fs.statSync(basePath).isDirectory()) {
            readFilesFromDirectory(basePath);
        } else {
            const extension = path.extname(basePath);
            if (['.js', '.ts', '.md', '.json'].includes(extension)) {
                filesContent[basePath.replace(__dirname + path.sep, '')] = fs.readFileSync(basePath, 'utf-8');
            }
        }
    });

    const outputDir = './src_to_json';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const outputName = inputPaths.length === 1 ? sanitizeFileName(inputPaths[0]) + '.json' : 'COMMON.json';
    const outputPath = path.join(outputDir, outputName);

    fs.writeFileSync(outputPath, JSON.stringify(filesContent, null, 2), 'utf-8');
    console.log(`Content has been combined into ${outputPath}`);
}

const paths = [
    'packages/core-api/src',
    // 'packages/core-api/README.md',
    'packages/wdio-sdk/src',
    // 'packages/wdio-sdk/README.md',
    'packages/playwright-sdk/src',
    // 'packages/playwright-sdk/README.md',
    'packages/syngrisi/src/server',
    // 'packages/syngrisi/README.md',
    'packages/create-sy/src',
    'packages/create-sy/README.md',
    'packages/wdio-syngrisi-cucumber-service/src',
    // 'packages/wdio-syngrisi-cucumber-service/README.md'
];

// core API
convertToJson('packages/core-api/src');
convertToJson('packages/core-api/README.md');

// wdio-sdk
convertToJson('packages/wdio-sdk/src');
convertToJson('packages/wdio-sdk/README.md');

// playwright-sdk
convertToJson('packages/playwright-sdk/src');
convertToJson('packages/playwright-sdk/README.md');

// syngrisi-server
convertToJson('packages/syngrisi/src/server');
convertToJson('packages/syngrisi/README.md');

// create-sy
convertToJson('packages/create-sy/src');
convertToJson('packages/create-sy/README.md');

// wdio-syngrisi-cucumber-service
convertToJson('packages/wdio-syngrisi-cucumber-service/src');
convertToJson('packages/wdio-syngrisi-cucumber-service/README.md');



convertToJson(paths);
