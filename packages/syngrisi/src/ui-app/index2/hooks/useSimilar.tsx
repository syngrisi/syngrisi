import { useQuery } from '@tanstack/react-query';
import config from '@config';
import { useParams } from '@hooks/useParams';

export interface SimilarData {
    similarTo?: string;
    ids: string[]; // query check + its ranked similar checks (best first)
    scoreById: Map<string, number>; // checkId -> 0..1 similarity (query check = 1)
    isLoading: boolean;
}

// "Find similar checks": fetch the ranked similar set for query.similarTo. The URL carries only the
// check id; the id list + per-check score live here so the grid can filter (via checkFilter._idIn)
// and order/badge by similarity. React Query dedupes, so calling this from several components is fine.
export function useSimilar(): SimilarData {
    const { query } = useParams();
    const similarTo = query.similarTo || undefined;

    const { data, isLoading } = useQuery({
        queryKey: ['check-similar', similarTo],
        enabled: !!similarTo,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const r = await fetch(`${config.baseUri}/v1/checks/${similarTo}/similar`, { credentials: 'include' });
            if (!r.ok) throw new Error(`similar request failed: ${r.status}`);
            return r.json() as Promise<{ results: { checkId: string; score: number }[] }>;
        },
    });

    const scoreById = new Map<string, number>();
    const ids: string[] = [];
    if (similarTo) {
        scoreById.set(similarTo, 1); // the query check itself = 100%
        ids.push(similarTo);
        for (const res of data?.results || []) {
            scoreById.set(res.checkId, res.score);
            ids.push(res.checkId);
        }
    }
    return { similarTo, ids, scoreById, isLoading };
}
