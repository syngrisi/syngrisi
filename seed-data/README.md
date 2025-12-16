# Syngrisi Seed Data Generator

This project is designed to populate the Syngrisi server with test data featuring various check statuses to demonstrate the capabilities of the visual testing system.

> 📖 **Main documentation**: [packages/syngrisi/README.md](../packages/syngrisi/README.md#seed-data)

## 📋 What Gets Created

The script creates the following types of test data:

### 1. **Baseline Tests**
- Login Page
- Dashboard  
- User Profile
- Settings Page
- Reports

These tests create baseline images for subsequent comparisons.

### 2. **Tests with PASSED Status** ✅
- Tests that fully match baseline images
- Created for Login Page (3 tests), Dashboard (5 tests), User Profile (2 tests)

### 3. **Tests with FAILED Status** ❌  
- Tests with visual differences from baseline images
- Created for Login Page (2 tests), Dashboard (3 tests), Settings Page (2 tests), Reports (1 test)

### 4. **Tests with NEW Status** 🆕
- New tests without baseline images
- Checkout Flow, Product Search, Admin Panel, Mobile View

### 5. **Tests with Mixed Statuses** 🔀
- User Registration Flow: passed → failed → new
- Shopping Cart: passed → passed → failed → new

### 6. **Cross-Browser Tests** 🌐
- Chromium, Firefox, WebKit
- Various resolutions: 1920x1080, 1366x768, 1440x900, 375x667

### 7. **Tests for Different Branches** 🌿
- main, develop, feature/new-ui, release/v2.0

## 🚀 Usage

### Prerequisites

1. Running Syngrisi server:
   ```bash
   # From monorepo root
   yarn start
   ```

2. Ensure the server is accessible at `http://localhost:3000`

### Running Data Generation

**Recommended method (from Syngrisi package):**
```bash
cd packages/syngrisi
npm run seed
# or
yarn seed
```

**Direct execution (from seed-data folder):**
```bash
cd seed-data
yarn install
yarn seed
```

**Fast mode:**
```bash
yarn seed:fast
```

### Environment Variable Configuration

You can configure connection parameters via environment variables:

```bash
# Syngrisi server URL
export SYNGRISI_URL=http://localhost:3000

# API key (default: 123)
export SYNGRISI_API_KEY=your-api-key

# Then run
yarn seed
```

Or specify directly in the command:
```bash
SYNGRISI_URL=http://localhost:3000 SYNGRISI_API_KEY=123 yarn seed
```

## 📊 Result

After executing the script, your Syngrisi server will contain:

- **~20+ tests** with various statuses
- **~50+ checks** 
- Tests for various:
  - Browsers (Chromium, Firefox, WebKit)
  - Screen resolutions
  - Operating systems
  - Development branches
  - Test suites

## 🔍 How to Use

After generating data, you can:

1. **Open the Syngrisi web interface**: `http://localhost:3000`
2. **View tests** with different statuses
3. **Explore check details** - compare baseline and actual snapshots
4. **Filter tests** by status, branch, browser, etc.
5. **Accept or reject** new snapshots

## 🛠 Project Structure

```
seed-data/
├── files/                  # Test images
│   ├── baseline.png       # Baseline image
│   ├── same.png          # Identical image (for PASSED)
│   └── different.png     # Different image (for FAILED)
├── tests/
│   └── seed.spec.ts      # Main data generation script
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## ⚠️ Important

- The script uses **Playwright SDK** for Syngrisi integration
- All tests are created **sequentially** (workers: 1) for correct baseline image creation
- **Baselines** are created first, followed by tests with other statuses
- Timeout is set to **120 seconds** in case of slow connections

## 🧹 Data Cleanup

If you want to remove the created data:

```bash
# From packages/syngrisi folder
yarn clean
```

⚠️ **Warning**: This command will delete **all** data from the database, not just data created by the script!

## 📝 Notes

- The script is designed to demonstrate Syngrisi capabilities
- Not intended for production use
- Creates data only in local installation (by default)
