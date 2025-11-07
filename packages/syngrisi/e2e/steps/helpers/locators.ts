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
  const locator = page.locator(locatorQuery);
  return index !== undefined ? locator.nth(index) : locator;
}
