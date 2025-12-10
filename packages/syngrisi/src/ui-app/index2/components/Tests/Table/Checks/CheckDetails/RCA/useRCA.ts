/**
 * useRCA Hook
 *
 * Manages RCA (Root Cause Analysis) state and data fetching.
 */

import { useState, useCallback, useEffect } from 'react';
import { RCAService } from '@shared/services';
import { diffDOMTrees } from '@shared/utils/domDiff';
import {
    DOMNode,
    DOMChange,
    DOMDiffResult,
    RCAState,
} from '@shared/interfaces/IRCA';

export interface UseRCAOptions {
    checkId: string | null;
    baselineId: string | null;
    apikey?: string;
    shareToken?: string;
}

export interface UseRCAReturn {
    state: RCAState;
    enable: () => void;
    disable: () => void;
    toggle: () => void;
    selectChange: (change: DOMChange | null) => void;
    selectElement: (element: DOMNode | null) => void;
    setHoveredElement: (element: DOMNode | null) => void;
}

const initialState: RCAState = {
    isEnabled: false,
    isPanelOpen: false,
    isLoading: false,
    error: null,
    baselineDom: null,
    actualDom: null,
    diffResult: null,
    selectedElement: null,
    selectedChange: null,
    hoveredElement: null,
};

export function useRCA(options: UseRCAOptions): UseRCAReturn {
    const [state, setState] = useState<RCAState>(initialState);

    const { checkId, baselineId, apikey, shareToken } = options;

    /**
     * Fetch DOM snapshots and perform diff analysis
     */
    const fetchAndAnalyze = useCallback(async () => {
        if (!checkId) {
            setState((prev) => ({
                ...prev,
                error: 'No check ID provided',
                isLoading: false,
            }));
            return;
        }

        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const { actual, baseline } = await RCAService.getDomSnapshots({
                checkId,
                baselineId: baselineId || undefined,
                apikey,
                shareToken,
            });

            if (!actual) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: 'No DOM snapshot available for this check. DOM capture may not have been enabled during the test run.',
                }));
                return;
            }

            // Perform diff analysis
            const diffResult = diffDOMTrees(baseline, actual);

            setState((prev) => ({
                ...prev,
                isLoading: false,
                actualDom: actual,
                baselineDom: baseline,
                diffResult,
                error: null,
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch DOM snapshots',
            }));
        }
    }, [checkId, baselineId, apikey, shareToken]);

    /**
     * Enable RCA mode
     */
    const enable = useCallback(() => {
        setState((prev) => ({
            ...prev,
            isEnabled: true,
            isPanelOpen: true,
        }));
        fetchAndAnalyze();
    }, [fetchAndAnalyze]);

    /**
     * Disable RCA mode
     */
    const disable = useCallback(() => {
        setState({
            ...initialState,
            isEnabled: false,
            isPanelOpen: false,
        });
    }, []);

    /**
     * Toggle RCA mode
     */
    const toggle = useCallback(() => {
        if (state.isEnabled) {
            disable();
        } else {
            enable();
        }
    }, [state.isEnabled, enable, disable]);

    /**
     * Select a change
     */
    const selectChange = useCallback((change: DOMChange | null) => {
        setState((prev) => ({
            ...prev,
            selectedChange: change,
            selectedElement: change?.actualNode || change?.baselineNode || null,
        }));
    }, []);

    /**
     * Select an element
     */
    const selectElement = useCallback((element: DOMNode | null) => {
        setState((prev) => ({
            ...prev,
            selectedElement: element,
        }));
    }, []);

    /**
     * Set hovered element
     */
    const setHoveredElement = useCallback((element: DOMNode | null) => {
        setState((prev) => ({
            ...prev,
            hoveredElement: element,
        }));
    }, []);

    // Re-fetch when check changes and RCA is enabled
    useEffect(() => {
        if (state.isEnabled && checkId) {
            fetchAndAnalyze();
        }
    }, [checkId, baselineId, state.isEnabled, fetchAndAnalyze]);

    return {
        state,
        enable,
        disable,
        toggle,
        selectChange,
        selectElement,
        setHoveredElement,
    };
}

export default useRCA;
