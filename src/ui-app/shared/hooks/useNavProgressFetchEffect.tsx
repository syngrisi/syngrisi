import {
    resetNavigationProgress,
    setNavigationProgress,
    startNavigationProgress,
} from '@mantine/nprogress';
import { useEffect } from 'react';

export function useNavProgressFetchEffect(isFetching: boolean) {
    useEffect(() => {
        if (isFetching) {
            resetNavigationProgress();
            startNavigationProgress();
        } else {
            setNavigationProgress(100);
        }
    }, [isFetching]);
}
