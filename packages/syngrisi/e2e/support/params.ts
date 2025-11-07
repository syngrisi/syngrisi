import { defineParameterType } from 'playwright-bdd';
import type { AriaRole } from '@helpers/types';
import { toAriaRole } from '@helpers/locators';
import {
  stateConditionNames,
  type StateCondition,
  type ValueCondition
} from '@helpers/assertions';

const ROLE_NAMES = [
  'button',
  'link',
  'heading',
  'textbox',
  'checkbox',
  'combobox',
  'navigation',
  'menuitem',
  'banner',
  'listitem',
  'list',
  'option',
  'tab',
  'article',
  'region',
  'status'
] as const;

const TARGET_NAMES = ['locator', 'label'] as const;

const VALUE_CONDITION_NAMES: ValueCondition[] = [
  'has text',
  'contains text',
  'has value',
  'contains value',
  'has class',
  'contains class',
  'has id',
  'has accessible name',
  'has accessible description',
  'has count',
  'has attribute',
  'has css'
];

export type StepCondition = StateCondition;
export type ElementTarget = (typeof TARGET_NAMES)[number];
export type ExpectationCondition = ValueCondition;
export const valueConditionNames = VALUE_CONDITION_NAMES;

defineParameterType({
  name: 'role',
  regexp: new RegExp(`(?:${ROLE_NAMES.join('|')})`),
  transformer: (value: string): AriaRole => toAriaRole(value)
});

defineParameterType({
  name: 'ordinal',
  regexp: /\d+(?:st|nd|rd|th)/,
  transformer: (value: string): number => {
    const numeric = Number.parseInt(value, 10);
    if (!Number.isFinite(numeric) || numeric < 1) {
      throw new Error(`Invalid ordinal: ${value}`);
    }
    return numeric - 1;
  }
});

defineParameterType({
  name: 'condition',
  regexp: new RegExp(`(?:${buildAlternation(stateConditionNames)})`),
  transformer: (value: string): StepCondition => normalizeCondition(value) as StepCondition
});

defineParameterType({
  name: 'target',
  regexp: new RegExp(`(?:${TARGET_NAMES.join('|')})`),
  transformer: (value: string): ElementTarget => value.toLowerCase() as ElementTarget
});

defineParameterType({
  name: 'valueCondition',
  regexp: new RegExp(`(?:${buildAlternation(VALUE_CONDITION_NAMES)})`),
  transformer: (value: string): ValueCondition => normalizeCondition(value) as ValueCondition
});

function normalizeCondition(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function buildAlternation(values: readonly string[]): string {
  const escaped = values
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((value) =>
      normalizeCondition(value)
        .replace(/\s+/g, '\\s+')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
  return escaped.join('|');
}
