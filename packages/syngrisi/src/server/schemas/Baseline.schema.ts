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
    matchType: z.enum(['antialiasing', 'nothing', 'colors']).openapi({
        description: 'Comparison mode: nothing (standard), antialiasing (auto-ignore), or colors (ignore color differences)',
        example: 'nothing'
    }).optional(),
});



export { BaselineGetSchema, BaselinePutSchema };

