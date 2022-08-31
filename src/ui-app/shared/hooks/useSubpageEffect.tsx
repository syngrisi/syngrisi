import { stopNavigationProgress } from '@mantine/nprogress';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../admin2/AppContext';

export function useSubpageEffect(title: string, deps?: any[]) {
    const { setAppTitle }: any = useContext(AppContext);
    useEffect(() => {
        setAppTitle(title);
        stopNavigationProgress();
    }, deps || []);
}
