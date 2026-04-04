# Mantine 5 → 7 Migration Guide

## Context

Branch: `chore/major-dependency-updates`
PR: syngrisi/syngrisi#24

The Syngrisi frontend was migrated from Mantine UI v5 to v7. This is a massive breaking change — Mantine 7 removed `createStyles`, `sx` prop, `@mantine/styles` package, `ColorSchemeProvider`, and changed APIs of most components. 150+ files were modified.

**Goal:** The new UI must look visually identical to the old one. All E2E tests must pass (303/303).

## How to Compare Old vs New

### Prerequisites

Both servers use the same MongoDB database (`SyngrisiDb` by default). Snapshot images are shared via symlink.

### Start OLD server (Mantine 5, port 5555)

```bash
# Create worktree from main (pre-migration code)
cd /Users/a1/Project/syngrisi
git worktree add /Users/a1/Project/syngrisi-old main

# Install dependencies
cd /Users/a1/Project/syngrisi-old && yarn install
cd packages/syngrisi/src/ui-app && yarn install

# Build
cd /Users/a1/Project/syngrisi-old/packages/syngrisi
yarn build:ui && yarn build:server

# Symlink snapshot images (so both servers show same images)
ln -sf /Users/a1/Project/syngrisi/packages/syngrisi/.snapshots-images \
       /Users/a1/Project/syngrisi-old/packages/syngrisi/.snapshots-images

# Run
SYNGRISI_APP_PORT=5555 SYNGRISI_AUTH=false node dist/server/server.js
```

Open http://localhost:5555

### Start NEW server (Mantine 7, port 3000)

```bash
cd /Users/a1/Project/syngrisi/packages/syngrisi

# Build UI (must rebuild after any code change)
yarn build:ui

# Run
SYNGRISI_APP_PORT=3000 SYNGRISI_AUTH=false node dist/server/server.js
```

Open http://localhost:3000

### Cleanup

```bash
pkill -f "SYNGRISI_APP_PORT"
cd /Users/a1/Project/syngrisi && git worktree remove /Users/a1/Project/syngrisi-old --force
```

### Taking Screenshots

```bash
cd /Users/a1/Project/syngrisi/packages/syngrisi/e2e
node -e "
const { chromium } = require('@playwright/test');
async function snap(port, prefix) {
  const b = await chromium.launch({headless:true});
  const p = await b.newPage({viewport:{width:1366,height:768}});
  await p.goto('http://127.0.0.1:'+port+'/', {waitUntil:'networkidle'});
  await p.waitForTimeout(5000);
  await p.screenshot({path:'/tmp/'+prefix+'-main.png'});
  await b.close();
}
(async()=>{await snap(5555,'old');await snap(3000,'new')})().catch(console.error);
"
```

### DOM Measurement Script

Use this to compare exact element dimensions, positions, colors between versions:

```bash
cd /Users/a1/Project/syngrisi/packages/syngrisi/e2e
node -e "
const { chromium } = require('@playwright/test');
async function audit(port, prefix) {
  const b = await chromium.launch({headless:true});
  const p = await b.newPage({viewport:{width:1366,height:768}});
  await p.goto('http://127.0.0.1:'+port+'/', {waitUntil:'networkidle'});
  await p.waitForTimeout(5000);
  const data = await p.evaluate(() => {
    function d(el) {
      if(!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),
        pad:s.padding, bg:s.backgroundColor, color:s.color, fs:s.fontSize,
        borderB:s.borderBottomWidth!=='0px'?s.borderBottom.substring(0,50):'-',
        borderR:s.borderRightWidth!=='0px'?s.borderRight.substring(0,50):'-',
      };
    }
    return {
      header: d(document.querySelector('header,[component=header]')),
      nav: d(document.querySelector('nav,[data-test=navbar-resizable-root]')),
      navItem0: d(document.querySelectorAll('[data-item-name]')[0]),
      thead: d(document.querySelector('thead,.mantine-Table-thead')),
      row0: d(document.querySelectorAll('tr[data-row-name]')[0]),
      td0: d(document.querySelector('tr[data-row-name] td')),
    };
  });
  console.log(prefix, JSON.stringify(data, null, 2));
  await b.close();
}
(async()=>{await audit(5555,'OLD');await audit(3000,'NEW')})().catch(console.error);
"
```

## Key Pages to Compare

| Page | OLD URL | NEW URL |
|------|---------|---------|
| Main (with data) | http://localhost:5555/ | http://localhost:3000/ |
| Expanded row | Click first table row | Click first table row |
| Admin Users | http://localhost:5555/admin/ | http://localhost:3000/admin/ |
| Admin Logs | Click "Logs" in admin sidebar | Click "Logs" in admin sidebar |
| Admin Settings | Click "Settings" in admin sidebar | Click "Settings" in admin sidebar |
| Auth/Login | http://localhost:5555/auth/ | http://localhost:3000/auth/ |

## Target Metrics (from OLD)

These are the reference values every element should match:

```
header:     1366×100, top:0, bg:white, borderBottom:1px solid rgb(233,236,239)
nav:        350×768, top:100, borderRight:1px solid rgb(233,236,239)
navItem:    327×56, borderBottom:1px solid rgb(233,236,239)
navItemName: fontSize:16px
thead:      1000×47, th color:rgb(73,80,87), borderBottom:1px solid
row:        1000×72
td:         padding:12px 10px, fontSize:14px
statusRing: x:259 (right-aligned in navItem)

Expanded row:
  container: gap:16px, padding:20px
  card:      180×207, shadow:sm
  title:     fontSize:14px, paper padding:12px
  img:       176×110, maxHeight:153.6px, objectFit:contain

Admin: header same as main, sidebar full height, no gap between header and content
```

## What Was Changed (Summary)

### Packages
- Removed: `@mantine/styles`, `@emotion/react`
- Updated: all `@mantine/*` from v5 to v7

### Providers (App.tsx × 3)
- `ColorSchemeProvider` removed → `defaultColorScheme` on MantineProvider
- `withGlobalStyles`/`withNormalizeCSS` → `import '@mantine/core/styles.css'`
- `NotificationsProvider` → `Notifications` (standalone, not wrapper)
- `SpotlightProvider` → `Spotlight` with new actions API
- Theme: `colorScheme` removed from theme object, `fontSizes: { md: '1rem' }`

### Styling (150+ files)
- `createStyles` → inline styles + `useComputedColorScheme()`
- `sx` prop → `style` prop (188 replacements)
- `@mantine/styles` imports → `@mantine/core`

### Props Renamed (global find/replace)
- `position="apart"` → `justify="space-between"` (and other position values)
- `spacing=` → `gap=`
- `color=` → `c=` (on Text)
- `weight=` → `fw=`
- `noWrap` → `wrap="nowrap"`
- `align=` → `ta=` (on Text)
- `icon=` → `leftSection=` (on Select, Menu.Item, NavLink)
- `transform=` → `tt=`
- Text `size={N}` → `fz={N}` (numeric size means line-height in v7!)

### Components Replaced
- `Navbar` → `Box component="nav"` with `height: 100vh`
- `Header` → `Box component="header"` with `position: fixed`
- `AppShell` → manual flex layout with fixed header + paddingTop
- `Table.Thead`/`Table.Tbody` used for proper CSS variable inheritance

### Critical Workarounds

#### List.Item onClick
Mantine 7 `List.Item` does NOT forward `onClick` to the DOM `<li>`. Fix: native DOM event listener via `useRef` + `useEffect`:
```tsx
const itemRef = useRef<HTMLLIElement>(null);
const handlerRef = useRef(handlerItemClick);
handlerRef.current = handlerItemClick;
useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => handlerRef.current(e);
    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
}, []);
// Then: <List.Item ref={itemRef} ...>
```
Files: all navbar Items (`RunItem.tsx`, `SuiteItem.tsx`, `BrowserItem.tsx`, `PlatformItem.tsx`, `StatusItem.tsx`, `AcceptStatusItem.tsx`)

#### Text size={N} = line-height, not font-size
In Mantine 7, `<Text size={16}>` sets line-height to 16 (unitless), resulting in `16 * fontSize = 256px line-height`. Use `fz={16}` for font-size.

#### List.Item itemWrapper/itemLabel width
Mantine 7 wraps List.Item content in `<span class="mantine-List-itemLabel">` which is `display: inline`. Fix via global CSS:
```css
.mantine-List-itemWrapper, .mantine-List-itemLabel { width: 100%; }
```

#### Table padding
Mantine 7 Table CSS only applies to `.mantine-Table-td` class. Plain `<td>` elements don't get padding. Fix via global CSS:
```css
.mantine-Table-table td, .mantine-Table-table th { padding: 12px 10px; }
.mantine-Table-table thead th { border-bottom: 1px solid var(--mantine-color-gray-2); color: rgb(73, 80, 87); }
```

#### ScrollArea infinity scroll
Mantine 7 ScrollArea changed internal structure. `viewportRef` and scroll listeners may not work. Fix: use `onBottomReached` callback + `IntersectionObserver` fallback in `SkeletonWrapper`.

#### Layout: fixed header
Mantine 5 `Header` was `position: fixed`. In v7, header is a regular Box in flow. Fix: wrap in `position: fixed` Box and add `paddingTop: 100` on content container.

## Known Remaining Differences (≤2-3px, not fixable)

These are internal Mantine 7 component rendering differences:

- `thead` height: +2px (Mantine 7 Table border calculation)
- `card` height: +2px (Mantine 7 Card internal padding)
- `breadcrumbs` height: +2px (Mantine 7 Breadcrumbs separator)
- `navItem` height: +1px (Mantine 7 List.Item wrapper)
- `navItem` Y position: -12px shift (Mantine 7 Select has smaller vertical margin)
- `Badge` borderRadius: 32px → 1000px (both visually round)
- `Badge` padding: 6.67px → 6px
- Input transparent border (Mantine 7 uses invisible border for focus styling)
- `searchBtn` text color: rgb(0,0,0) → rgb(33,37,41) (Mantine 7 default body color)

## Running E2E Tests

```bash
cd /Users/a1/Project/syngrisi/packages/syngrisi

# Build UI first
yarn build:ui

# Run all 303 tests
yarn test
```

Best result so far: **303/303 passed, 0 failed** (before latest visual fixes).

After visual fixes, run tests to verify no regressions:
```bash
yarn build:ui && yarn test
```

## Key Files

| File | What |
|------|------|
| `src/ui-app/index2/App.tsx` | Main app providers, theme, Spotlight |
| `src/ui-app/admin/App.tsx` | Admin app providers, theme |
| `src/ui-app/auth/App.tsx` | Auth app providers |
| `src/ui-app/index2/IndexLayout.tsx` | Main page layout (fixed header, global CSS) |
| `src/ui-app/admin/AdminLayout.tsx` | Admin layout (fixed header) |
| `src/ui-app/index2/components/Navbar/NavbarIndex.tsx` | Navbar (100vh, borderRight, icons) |
| `src/ui-app/index2/components/Navbar/Items/RunItem.tsx` | Navbar item (ref onClick workaround) |
| `src/ui-app/index2/components/Tests/Table/TestsTable.tsx` | Table (Table.Thead/Tbody, verticalSpacing) |
| `src/ui-app/index2/components/Tests/Table/Row.tsx` | Table row |
| `src/ui-app/index2/components/Tests/Table/Checks/Check.tsx` | Check preview card |
| `src/ui-app/shared/hooks/useInfinityScroll.tsx` | Infinity scroll hook |
| `src/ui-app/index2/components/Navbar/Skeletons/SkeletonWrapper.tsx` | Navbar infinite scroll |
| `src/ui-app/index2/components/Tests/Table/InfinityScrollSkeleton.tsx` | Table infinite scroll |
| `src/ui-app/shared/components/Header/HeaderLogo.tsx` | Logo + brand text |
| `src/ui-app/index2/hooks/useNavbarActiveItems.tsx` | Navbar click → filter |
| `src/ui-app/shared/components/Tests/StatusesRing.tsx` | StatusRing in navbar items |
