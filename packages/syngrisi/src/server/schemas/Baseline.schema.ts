import { z } from 'zod';
import { commonValidations } from './utils';

const BaselineGetSchema = z.object({
    _id: commonValidations.id,
    name: z.string().min(1).openapi({
        description: 'Name of the baseline',
        example: 'Green Button'
    }),
    app: commonValidations.id.openapi({
        description: 'Application identifier for the baseline',
        example: '6651dd45b9c3e1e0b8c1ce26'
    }),
    branch: z.string().min(1).openapi({
        description: 'Branch name for the baseline',
        example: 'master'
    }),
    browserName: z.string().min(1).openapi({
        description: 'Browser name used for the baseline',
        example: 'chrome'
    }),
    viewport: z.string().min(1).openapi({
        description: 'Viewport size used for the baseline',
        example: '1366x768'
    }),
    os: z.string().min(1).openapi({
        description: 'Operating system used for the baseline',
        example: 'macOS'
    }),
    createdDate: commonValidations.date.openapi({
        description: 'Creation date of the baseline',
        example: '2024-05-26T10:49:19.896Z'
    }),
    lastMarkedDate: commonValidations.date.openapi({
        description: 'Last marked date of the baseline',
        example: '2024-05-26T10:49:19.852Z'
    }),
    markedAs: z.string().min(1).openapi({
        description: 'Status marked for the baseline',
        example: 'accepted'
    }),

    markedById: commonValidations.id.openapi({
        description: 'Identifier of the user who marked the baseline',
        example: '66519e582c2c701cc438ce59'
    }),
    markedByUsername: z.string().min(1).openapi({
        description: 'Username of the user who marked the baseline',
        example: 'Guest'
    }),
    snapshootId: commonValidations.id.openapi({
        description: 'Snapshot identifier for the baseline',
        example: '6651ec20917e9ce26f7c0849'
    }),
    toleranceThreshold: z.number().min(0).max(100).openapi({
        description: 'Mismatch tolerance threshold in percent. If diff is less than or equal to this value, check can pass.',
        example: 0.6,
    }).optional(),
    id: commonValidations.id,
});

// export type BaselineType = z.infer<typeof BaselineGetSchema>;

const BaselinePutSchema = z.object({
    name: z.string().min(1).openapi({
        description: 'Name of the baseline',
        example: 'Green Button'
    }).optional(),
    branch: z.string().min(1).openapi({
        description: 'Branch name for the baseline',
        example: 'master'
    }).optional(),
    browserName: z.string().min(1).openapi({
        description: 'Browser name used for the baseline',
        example: 'chrome'
    }).optional(),
    viewport: z.string().min(1).openapi({
        description: 'Viewport size used for the baseline',
        example: '1366x768'
    }).optional(),
    os: z.string().min(1).openapi({
        description: 'Operating system used for the baseline',
        example: 'macOS'
    }).optional(),
    createdDate: commonValidations.date.openapi({
        description: 'Creation date of the baseline',
        example: '2024-05-26T10:49:19.896Z'
    }).optional(),
    lastMarkedDate: commonValidations.date.openapi({
        description: 'Last marked date of the baseline',
        example: '2024-05-26T10:49:19.852Z'
    }).optional(),
    markedAs: z.string().min(1).openapi({
        description: 'Status marked for the baseline',
        example: 'accepted'
    }).optional(),
    markedById: commonValidations.id.openapi({
        description: 'Identifier of the user who marked the baseline',
        example: '66519e582c2c701cc438ce59'
    }).optional(),
    markedByUsername: z.string().min(1).openapi({
        description: 'Username of the user who marked the baseline',
        example: 'Guest'
    }).optional(),
    ignoreRegions: z.string().openapi({
        description: 'JSON string representing regions to ignore during comparison',
        example: '[{"left":0,"top":0,"right":100,"bottom":50}]'
    }).optional(),
    boundRegions: z.string().openapi({
        description: 'JSON string representing the checked area (only compare within this region)',
        example: '[{"left":0,"top":0,"right":500,"bottom":300}]'
    }).optional(),
    matchType: z.enum(['antialiasing', 'nothing', 'colors', 'tolerant']).openapi({
        description: 'Comparison mode: nothing (pixel-perfect, exact, default), tolerant (allow minor per-pixel differences, ±16), antialiasing (auto-ignore anti-aliasing), or colors (ignore color differences)',
        example: 'nothing'
    }).optional(),
    toleranceThreshold: z.number().min(0).max(100).openapi({
        description: 'Mismatch tolerance threshold in percent',
        example: 0.6,
    }).optional(),
});



// Time machine: ident used to look up a check's accepted-baseline history. Unlike the SDK-facing
// `client.route.ts` ident (where `app` is the app *name*), this mirrors how the UI already reads
// baselines (`GET /v1/baselines`) - `app` is the App document's ObjectId.
const BaselineHistoryIdentSchema = z.object({
    name: z.string().min(1),
    app: commonValidations.id,
    branch: z.string().min(1),
    browserName: z.string().min(1),
    viewport: z.string().min(1),
    os: z.string().min(1),
});

const BaselineHistoryFilterSchema = z
    .string()
    .refine((data) => {
        try {
            const parsed = JSON.parse(data);
            BaselineHistoryIdentSchema.parse(parsed);
            return true;
        } catch {
            return false;
        }
    }, {
        message: 'Invalid JSON string or does not match the required ident schema',
    })
    .openapi({
        description: 'Check ident (name, app id, branch, browserName, viewport, os) as a JSON string, used to look up its accepted-baseline history',
        example: '{"name":"Login page","app":"6651dd45b9c3e1e0b8c1ce26","branch":"master","browserName":"chrome","viewport":"1366x768","os":"macOS"}',
    });

const BaselineHistoryQuerySchema = z.object({
    filter: BaselineHistoryFilterSchema,
});

const BaselineHistoryItemSchema = z.object({
    id: commonValidations.id,
    createdDate: commonValidations.date,
    markedByUsername: z.string().optional(),
    filename: z.string().optional(),
    imageUrl: z.string().optional(),
});

const HistorySummaryBodySchema = z.object({
    fromBaselineId: commonValidations.id.openapi({
        description: 'Older baseline id in the pair being compared',
        example: '6651ec20917e9ce26f7c0849',
    }),
    toBaselineId: commonValidations.id.openapi({
        description: 'Newer baseline id in the pair being compared',
        example: '6651ec20917e9ce26f7c0850',
    }),
});

const HistorySummaryResponseSchema = z.object({
    summary: z.string().nullable(),
    reason: z.string().optional(),
    cached: z.boolean().optional(),
});

// Promote all ACCEPTED baselines from a source branch to a target branch (typically the
// project's mainBranch). Accepts EITHER a runId (resolves app/fromBranch/toBranch from the
// run) OR an explicit app + fromBranch (+ optional toBranch, defaults to the app's mainBranch).
// Both shapes are optional here; the controller validates which combination is actually usable.
const BaselinePromoteSchema = z.object({
    runId: commonValidations.id.optional().openapi({
        description: 'Run identifier - promotes all branches used by the run to the app mainBranch',
        example: '6651dd45b9c3e1e0b8c1ce27',
    }),
    app: commonValidations.id.optional().openapi({
        description: 'Application identifier',
        example: '6651dd45b9c3e1e0b8c1ce26',
    }),
    fromBranch: z.string().min(1).optional().openapi({
        description: 'Source branch whose accepted baselines are promoted',
        example: 'feature-x',
    }),
    toBranch: z.string().min(1).optional().openapi({
        description: 'Target branch to promote baselines to (defaults to the app mainBranch)',
        example: 'main',
    }),
});

const BaselinePromoteResponseSchema = z.object({
    promoted: z.number(),
    fromBranch: z.string(),
    toBranch: z.string(),
});

export {
    BaselineGetSchema,
    BaselinePutSchema,
    BaselineHistoryIdentSchema,
    BaselineHistoryFilterSchema,
    BaselineHistoryQuerySchema,
    BaselineHistoryItemSchema,
    HistorySummaryBodySchema,
    HistorySummaryResponseSchema,
    BaselinePromoteSchema,
    BaselinePromoteResponseSchema,
};
