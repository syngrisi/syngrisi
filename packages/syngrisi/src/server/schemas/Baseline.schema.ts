import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
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
});


export { BaselineGetSchema, BaselinePutSchema };

const registry = new OpenAPIRegistry();
registry.registerComponent('schemas', 'BaselineGetSchema', BaselineGetSchema);
registry.registerComponent('schemas', 'BaselinePutSchema', BaselinePutSchema);
