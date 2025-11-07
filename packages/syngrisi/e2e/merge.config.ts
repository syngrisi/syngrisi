import { config, env } from '@config';
import path from 'path';
import { defineConfig } from '@playwright/test';

const mergedHtmlPath = path.resolve(process.cwd(), config.mergedReportPath);
const blobReportPath = path.resolve(process.cwd(), config.blobReportPath);

console.log('Merged HTML report path:', mergedHtmlPath);
console.log('Blob report path:', blobReportPath);

export default defineConfig({
  reporter: [
    [
      'html',
      {
        open: env.CI ? 'never' : 'on-failure',
        outputFolder: mergedHtmlPath,
      },
    ],
    [
      'blob',
      {
        outputDir: blobReportPath,
      },
    ],
  ],
  use: {
    trace: 'retain-on-failure',
  },
});

