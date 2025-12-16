import type { Locator, Page } from '@playwright/test';
import { AriaRole } from '@helpers/types';

const ROLE_ALIASES: Record<string, AriaRole> = {
  button: 'button',
  link: 'link',
  heading: 'heading',
  textbox: 'textbox',
  checkbox: 'checkbox',
  combobox: 'combobox',
  navigation: 'navigation',
  banner: 'banner',
  listitem: 'listitem',
  list: 'list',
  option: 'option',
  tab: 'tab'
};

export function toAriaRole(rawRole: string): AriaRole {
  const normalized = rawRole.trim().toLowerCase();
  return ROLE_ALIASES[normalized] ?? (normalized as AriaRole);
}

export function getRoleLocator(
  page: Page,
  role: string,
  name: string,
  index?: number
): Locator {
  const locator = page.getByRole(toAriaRole(role), { name, exact: true });
  return index !== undefined ? locator.nth(index) : locator;
}

export function getLabelLocator(
  page: Page,
  label: string,
  index?: number
): Locator {
  const locator = page.getByLabel(label, { exact: true });
  return index !== undefined ? locator.nth(index) : locator;
}

export function getLocatorQuery(
  page: Page,
  locatorQuery: string,
  index?: number
): Locator {
  const normalizedInput = locatorQuery.trim();
  const viewTabPattern = /^div=(Expected|Actual|Difference|Slider)$/;
  const viewMatch = normalizedInput.match(viewTabPattern);
  if (viewMatch) {
    const viewName = viewMatch[1].toLowerCase();
    const dataCheckValue = viewName === 'difference' ? 'diff-view' : `${viewName}-view`;
    const locator = page.locator(`[data-check='${dataCheckValue}']`);
    return index !== undefined ? locator.nth(index) : locator;
  }
  // Convert WebdriverIO's *= syntax (tag*=text) to Playwright's :has-text() syntax
  // Special case: "span*=TU", "span*=TR", "span*=JD" etc. are user initials displayed in [data-test="user-icon"] button
  // Example: "span*=TU" -> "[data-test='user-icon']:has-text('TU')"
  const webdriverIOContainsPattern = /^([a-zA-Z0-9_-]+)\*=(.+)$/;
  const matchContains = locatorQuery.match(webdriverIOContainsPattern);
  
  // Convert WebdriverIO's = syntax (tag=text) to Playwright's :has-text() syntax
  // Example: "span=Generate" -> "span:has-text('Generate')"
  const webdriverIOExactPattern = /^([a-zA-Z0-9_-]+)=(.+)$/;
  const matchExact = locatorQuery.match(webdriverIOExactPattern);
  
  let normalizedQuery: string;
  if (matchContains) {
    const [, tag, text] = matchContains;
    // User initials (TU, TR, JD, TA, RR, SD, SG) are displayed in button with data-test="user-icon"
    if (tag === 'span' && /^[A-Z]{2}$/.test(text)) {
      // User initials are in button[data-test="user-icon"], use exact text match
      normalizedQuery = `[data-test='user-icon']:has-text('${text}')`;
    } else {
      normalizedQuery = `${tag}:has-text('${text}')`;
    }
  } else if (matchExact) {
    const [, tag, text] = matchExact;
    normalizedQuery = `${tag}:has-text('${text}')`;
  } else {
    normalizedQuery = locatorQuery;
  }
  
  const locator = page.locator(normalizedQuery);
  return index !== undefined ? locator.nth(index) : locator;
}
