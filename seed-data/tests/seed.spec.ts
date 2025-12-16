import { test } from '@playwright/test';
import { PlaywrightDriver } from '@syngrisi/playwright-sdk';
import * as fs from 'fs';
import * as path from 'path';

const SYNGRISI_URL = (process.env.SYNGRISI_URL || 'http://localhost:3000').replace(/\/$/, '') + '/';
const SYNGRISI_API_KEY = process.env.SYNGRISI_API_KEY || '123';
const SEED_MODE = process.env.SEED_MODE || 'full';

const baselineImg = fs.readFileSync(path.join(__dirname, '../files/baseline.png'));
const sameImg = fs.readFileSync(path.join(__dirname, '../files/same.png'));
const differentImg = fs.readFileSync(path.join(__dirname, '../files/different.png'));

test.describe('Syngrisi Seed Data', () => {
  let driver: PlaywrightDriver;

  test.beforeEach(async ({ page, browser }) => {
    const config = {
      page,
      url: SYNGRISI_URL,
      apiKey: SYNGRISI_API_KEY,
    };
    console.log(`Initializing PlaywrightDriver with config:`, JSON.stringify({
      url: config.url,
      apiKey: config.apiKey,
      hasPage: !!config.page
    }));
    driver = new PlaywrightDriver(config);
  });

  test('Seed baseline tests', async () => {
    console.log('🌱 Creating baseline tests...');
    
    const baselineTests = [
      { name: 'Login Page', suite: 'Authentication', tags: ['smoke', 'critical'] },
      { name: 'Dashboard', suite: 'Main Features', tags: ['smoke'] },
      { name: 'User Profile', suite: 'User Management', tags: ['regression'] },
      { name: 'Settings Page', suite: 'Configuration', tags: ['regression'] },
      { name: 'Reports', suite: 'Analytics', tags: ['extended'] },
    ];

    for (const testConfig of baselineTests) {
      await driver.startTestSession({
        params: {
          app: 'Demo Application',
          test: testConfig.name,
          run: 'Baseline Run',
          runident: 'baseline-run-001',
          branch: 'main',
          suite: testConfig.suite,
          tags: testConfig.tags,
          os: 'macOS',
          browserName: 'chromium',
          browserVersion: '131',
          viewport: '1920x1080',
        },
      });

      await driver.check({
        checkName: `${testConfig.name} - Main View`,
        imageBuffer: baselineImg,
        params: {},
      });

      await driver.stopTestSession();
      console.log(`  ✓ Created baseline: ${testConfig.name}`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  });

  test('Seed tests with PASSED status', async () => {
    console.log('✅ Creating tests with PASSED status...');
    
    const passedTests = [
      { name: 'Login Page', suite: 'Authentication', tags: ['smoke', 'critical'], count: 3 },
      { name: 'Dashboard', suite: 'Main Features', tags: ['smoke'], count: 5 },
      { name: 'User Profile', suite: 'User Management', tags: ['regression'], count: 2 },
    ];

    for (const testConfig of passedTests) {
      for (let i = 1; i <= testConfig.count; i++) {
        await driver.startTestSession({
          params: {
            app: 'Demo Application',
            test: testConfig.name,
            run: `Test Run ${i}`,
            runident: `run-passed-${Date.now()}-${i}`,
            branch: 'main',
            suite: testConfig.suite,
            tags: testConfig.tags,
            os: 'macOS',
            browserName: 'chromium',
            browserVersion: '131',
            viewport: '1920x1080',
          },
        });

        await driver.check({
          checkName: `${testConfig.name} - Main View`,
          imageBuffer: sameImg,
          params: {},
        });

        await driver.stopTestSession();
      }
      console.log(`  ✓ Created ${testConfig.count} passed tests for: ${testConfig.name}`);
    }
  });

  test('Seed tests with FAILED status', async () => {
    console.log('❌ Creating tests with FAILED status...');
    
    const failedTests = [
      { name: 'Login Page', suite: 'Authentication', tags: ['smoke', 'critical'], count: 2 },
      { name: 'Dashboard', suite: 'Main Features', tags: ['smoke'], count: 3 },
      { name: 'Settings Page', suite: 'Configuration', tags: ['regression'], count: 2 },
      { name: 'Reports', suite: 'Analytics', tags: ['extended'], count: 1 },
    ];

    for (const testConfig of failedTests) {
      for (let i = 1; i <= testConfig.count; i++) {
        await driver.startTestSession({
          params: {
            app: 'Demo Application',
            test: testConfig.name,
            run: `Failed Run ${i}`,
            runident: `run-failed-${Date.now()}-${i}`,
            branch: 'main',
            suite: testConfig.suite,
            tags: testConfig.tags,
            os: 'macOS',
            browserName: 'chromium',
            browserVersion: '131',
            viewport: '1920x1080',
          },
        });

        await driver.check({
          checkName: `${testConfig.name} - Main View`,
          imageBuffer: differentImg,
          params: {},
        });

        await driver.stopTestSession();
      }
      console.log(`  ✓ Created ${testConfig.count} failed tests for: ${testConfig.name}`);
    }
  });

  test('Seed tests with NEW status', async () => {
    console.log('🆕 Creating tests with NEW status...');
    
    const newTests = [
      { name: 'Checkout Flow', suite: 'E-Commerce', tags: ['new', 'critical'], checks: 3 },
      { name: 'Product Search', suite: 'E-Commerce', tags: ['new'], checks: 2 },
      { name: 'Admin Panel', suite: 'Administration', tags: ['new', 'admin'], checks: 4 },
      { name: 'Mobile View', suite: 'Responsive', tags: ['new', 'mobile'], checks: 2 },
    ];

    for (const testConfig of newTests) {
      await driver.startTestSession({
        params: {
          app: 'Demo Application',
          test: testConfig.name,
          run: 'New Features Run',
          runident: `run-new-${Date.now()}`,
          branch: 'develop',
          suite: testConfig.suite,
          tags: testConfig.tags,
          os: 'macOS',
          browserName: 'chromium',
          browserVersion: '131',
          viewport: '1920x1080',
        },
      });

      for (let i = 1; i <= testConfig.checks; i++) {
        await driver.check({
          checkName: `${testConfig.name} - Step ${i}`,
          imageBuffer: baselineImg,
          params: {},
        });
      }

      await driver.stopTestSession();
      console.log(`  ✓ Created new test with ${testConfig.checks} checks: ${testConfig.name}`);
    }
  });

  test('Seed mixed status tests with multiple checks', async () => {
    console.log('🔀 Creating tests with mixed check statuses...');
    
    const mixedTests = [
      { 
        name: 'User Registration Flow',
        suite: 'Authentication',
        tags: ['critical', 'e2e'],
        checks: [
          { name: 'Registration Form', image: sameImg, status: 'passed' },
          { name: 'Email Verification', image: differentImg, status: 'failed' },
          { name: 'Welcome Screen', image: baselineImg, status: 'new' },
        ]
      },
      {
        name: 'Shopping Cart',
        suite: 'E-Commerce',
        tags: ['critical'],
        checks: [
          { name: 'Empty Cart', image: sameImg, status: 'passed' },
          { name: 'Add Product', image: sameImg, status: 'passed' },
          { name: 'Update Quantity', image: differentImg, status: 'failed' },
          { name: 'Apply Coupon', image: baselineImg, status: 'new' },
        ]
      },
    ];

    for (const testConfig of mixedTests) {
      await driver.startTestSession({
        params: {
          app: 'Demo Application',
          test: testConfig.name,
          run: 'Mixed Status Run',
          runident: `run-mixed-${Date.now()}`,
          branch: 'main',
          suite: testConfig.suite,
          tags: testConfig.tags,
          os: 'macOS',
          browserName: 'chromium',
          browserVersion: '131',
          viewport: '1920x1080',
        },
      });

      for (const check of testConfig.checks) {
        await driver.check({
          checkName: check.name,
          imageBuffer: check.image,
          params: {},
        });
      }

      await driver.stopTestSession();
      console.log(`  ✓ Created mixed test: ${testConfig.name} (${testConfig.checks.length} checks)`);
    }
  });

  test('Seed tests with different browsers and viewports', async () => {
    console.log('🌐 Creating tests with different configurations...');
    
    const configs = [
      { browser: 'chromium', version: '131', viewport: '1920x1080', os: 'macOS' },
      { browser: 'firefox', version: '122', viewport: '1366x768', os: 'Windows' },
      { browser: 'webkit', version: '17.4', viewport: '1440x900', os: 'macOS' },
      { browser: 'chromium', version: '131', viewport: '375x667', os: 'iOS' },
    ];

    for (const config of configs) {
      await driver.startTestSession({
        params: {
          app: 'Demo Application',
          test: 'Cross-Browser Test',
          run: `${config.browser} ${config.viewport}`,
          runident: `run-cross-${Date.now()}-${config.browser}`,
          branch: 'main',
          suite: 'Cross-Browser Testing',
          tags: ['cross-browser', config.browser],
          os: config.os,
          browserName: config.browser,
          browserVersion: config.version,
          viewport: config.viewport,
          viewport: config.viewport,
        },
      });

      await driver.check({
        checkName: 'Homepage',
        imageBuffer: sameImg,
        params: {},
      });

      await driver.stopTestSession();
      console.log(`  ✓ Created test: ${config.browser}@${config.viewport} on ${config.os}`);
    }
  });

  test('Seed tests with different branches', async () => {
    console.log('🌿 Creating tests for different branches...');
    
    const branches = ['main', 'develop', 'feature/new-ui', 'release/v2.0'];

    for (const branch of branches) {
      await driver.startTestSession({
        params: {
          app: 'Demo Application',
          test: 'Multi-Branch Test',
          run: `Branch Test - ${branch}`,
          runident: `run-branch-${Date.now()}-${branch}`,
          branch: branch,
          suite: 'Branch Testing',
          tags: ['branch', branch.replace('/', '-')],
          os: 'macOS',
          browserName: 'chromium',
          browserVersion: '131',
          viewport: '1920x1080',
        },
      });

      await driver.check({
        checkName: 'Branch Specific View',
        imageBuffer: branch === 'main' ? sameImg : differentImg,
        params: {},
      });

      await driver.stopTestSession();
      console.log(`  ✓ Created test for branch: ${branch}`);
    }
  });

  // --- NEW SCENARIO: Mixed Results (2 Passed, 2 Failed) ---
  test('Create test with 4 checks (2 passed, 2 failed)', async () => {
    const testName = 'Mixed Results Test';
    const suiteName = 'Seeding Scenarios';
    const branchName = 'main';
    const appName = 'Seed App';

    // 1. Create Baseline Run (Apply all 4 checks)
    console.log('🌱 Creating Baseline Run (Run 1)...');
    await driver.startTestSession({
      params: {
        app: appName,
        test: testName,
        run: 'Baseline Run',
        runident: `seed-baseline-${Date.now()}`,
        branch: branchName,
        suite: suiteName,
        tags: ['seed', 'baseline'],
      },
    });

    // Check 1: Baseline A
    await driver.check({
      checkName: 'Check 1 (Will Pass)',
      imageBuffer: baselineImg,
      params: { autoAccept: true }, // Apply immediately
    });

    // Check 2: Baseline B
    await driver.check({
      checkName: 'Check 2 (Will Pass)',
      imageBuffer: sameImg,
      params: { autoAccept: true }, // Apply immediately
    });

    // Check 3: Baseline C
    await driver.check({
      checkName: 'Check 3 (Will Fail)',
      imageBuffer: baselineImg,
      params: { autoAccept: true }, // Apply immediately
    });

    // Check 4: Baseline D
    await driver.check({
      checkName: 'Check 4 (Will Fail)',
      imageBuffer: sameImg,
      params: { autoAccept: true }, // Apply immediately
    });

    await driver.stopTestSession();
    console.log('  ✓ Baseline Run completed and checks accepted.');

    // 2. Create Regression Run (2 Passed, 2 Failed)
    console.log('🧪 Creating Regression Run (Run 2)...');
    await driver.startTestSession({
      params: {
        app: appName,
        test: testName,
        run: 'Regression Run',
        runident: `seed-regression-${Date.now()}`,
        branch: branchName,
        suite: suiteName,
        tags: ['seed', 'regression'],
      },
    });

    // Check 1: Matches Baseline A (Passed)
    await driver.check({
      checkName: 'Check 1 (Will Pass)',
      imageBuffer: baselineImg,
      params: {},
    });

    // Check 2: Matches Baseline B (Passed)
    await driver.check({
      checkName: 'Check 2 (Will Pass)',
      imageBuffer: sameImg,
      params: {},
    });

    // Check 3: Differs from Baseline C (Failed)
    await driver.check({
      checkName: 'Check 3 (Will Fail)',
      imageBuffer: differentImg,
      params: {},
    });

    // Check 4: Differs from Baseline D (Failed)
    await driver.check({
      checkName: 'Check 4 (Will Fail)',
      imageBuffer: differentImg,
      params: {},
    });

    await driver.stopTestSession();
    console.log('  ✓ Regression Run completed.');
  });
});
