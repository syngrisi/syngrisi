/**
 * @fileoverview Custom step registry that captures step registrations outside Playwright context.
 *
 * playwright-bdd's createBdd() only registers steps when running within Playwright test context.
 * This module provides a wrapper that captures step registrations in our own registry,
 * allowing the MCP server to find and execute steps.
 */

import { createBdd as originalCreateBdd } from 'playwright-bdd';
import logger, { formatArgs } from './logger';

type StepFunction = (...args: any[]) => any;

interface StepDefinition {
    keyword: 'Given' | 'When' | 'Then';
    pattern: string | RegExp;
    patternString: string;
    fn: StepFunction;
    line?: number;
}

export interface MatchedStep {
    definition: StepDefinition;
    match: RegExpMatchArray | null;
    getMatchedParameters: () => Promise<any[]>;
    getStepMatchArguments: () => any[];
}

// Global registry for step definitions
const customStepDefinitions: StepDefinition[] = [];

/**
 * Convert a pattern to a regex if it isn't one already.
 */
const patternToRegex = (pattern: string | RegExp): RegExp => {
    if (pattern instanceof RegExp) {
        return pattern;
    }
    // Escape special regex characters but preserve common Cucumber expression patterns
    // Handle {string}, {int}, {float} placeholders
    let regexStr = pattern
        .replace(/[-/\\^$*+?.()|[\]]/g, '\\$&') // Escape regex special chars
        .replace(/\\\{string\\\}/g, '"([^"]*)"')  // {string} -> capture quoted string
        .replace(/\\\{int\\\}/g, '(-?\\d+)')       // {int} -> capture integer
        .replace(/\\\{float\\\}/g, '(-?\\d+\\.?\\d*)'); // {float} -> capture float

    return new RegExp(`^${regexStr}$`);
};

/**
 * Extract pattern string for display.
 */
const getPatternString = (pattern: string | RegExp): string => {
    if (pattern instanceof RegExp) {
        return pattern.source;
    }
    return pattern;
};

/**
 * Register a step definition in the custom registry.
 */
const registerStep = (
    keyword: 'Given' | 'When' | 'Then',
    pattern: string | RegExp,
    fn: StepFunction,
): void => {
    const patternString = getPatternString(pattern);

    // Avoid duplicates
    const exists = customStepDefinitions.some(
        (s) => s.keyword === keyword && s.patternString === patternString,
    );
    if (exists) {
        return;
    }

    customStepDefinitions.push({
        keyword,
        pattern,
        patternString,
        fn,
    });

    logger.debug(formatArgs(`📝 Registered step: ${keyword} ${patternString}`));
};

/**
 * Create a wrapper around playwright-bdd's createBdd that also registers steps in our registry.
 */
export const createBddWithCapture = <T extends Record<string, any>>(fixtures?: T) => {
    // Get the original functions from playwright-bdd
    const original = originalCreateBdd<T>(fixtures);

    // Create wrappers that register in our custom registry
    const wrappedGiven = (pattern: string | RegExp, fn: StepFunction) => {
        registerStep('Given', pattern, fn);
        return original.Given(pattern, fn);
    };

    const wrappedWhen = (pattern: string | RegExp, fn: StepFunction) => {
        registerStep('When', pattern, fn);
        return original.When(pattern, fn);
    };

    const wrappedThen = (pattern: string | RegExp, fn: StepFunction) => {
        registerStep('Then', pattern, fn);
        return original.Then(pattern, fn);
    };

    return {
        Given: wrappedGiven,
        When: wrappedWhen,
        Then: wrappedThen,
        // Pass through other exports if any
        ...(Object.keys(original).reduce((acc, key) => {
            if (!['Given', 'When', 'Then'].includes(key)) {
                acc[key] = (original as any)[key];
            }
            return acc;
        }, {} as Record<string, any>)),
    };
};

/**
 * Get all registered step definitions.
 */
export const getCustomStepDefinitions = (): StepDefinition[] => {
    return [...customStepDefinitions];
};

/**
 * Find step definitions matching the given text.
 */
export const findCustomStepDefinitions = (stepText: string): MatchedStep[] => {
    const results: MatchedStep[] = [];

    for (const definition of customStepDefinitions) {
        const regex = patternToRegex(definition.pattern);
        const match = stepText.match(regex);

        if (match) {
            results.push({
                definition,
                match,
                getMatchedParameters: async () => {
                    // Extract captured groups (skip the full match at index 0)
                    return match.slice(1).map((param) => {
                        // Try to parse as number if it looks like one
                        if (/^-?\d+$/.test(param)) {
                            return parseInt(param, 10);
                        }
                        if (/^-?\d+\.?\d*$/.test(param)) {
                            return parseFloat(param);
                        }
                        return param;
                    });
                },
                getStepMatchArguments: () => {
                    return match.slice(1).map((value, index) => ({
                        group: {
                            start: match.index! + (match[0].indexOf(value) || 0),
                            value,
                        },
                        parameterTypeName: 'string',
                    }));
                },
            });
        }
    }

    return results;
};

/**
 * Execute a matched step with the given fixtures.
 */
export const executeCustomStep = async (
    matchedStep: MatchedStep,
    fixtures: Record<string, any>,
): Promise<any> => {
    const parameters = await matchedStep.getMatchedParameters();
    return matchedStep.definition.fn(fixtures, ...parameters);
};

/**
 * Clear the custom step registry (useful for testing).
 */
export const clearCustomStepRegistry = (): void => {
    customStepDefinitions.length = 0;
};

/**
 * Get the count of registered steps.
 */
export const getCustomStepCount = (): number => {
    return customStepDefinitions.length;
};
