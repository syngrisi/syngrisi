import { z } from 'zod';
import { commonValidations } from './utils';

const ClientStartSessionSchema = z.object({
    name: z.string().min(1).openapi({
        description: 'Name of the session',
        example: 'Login test'
    }),
    app: z.string().min(1).openapi({
        description: 'Application name',
        example: 'My project'
    }),
    tags: z.string().openapi({
        description: 'Tags associated with the session',
        example: "[\"@smoke\", \"@PJ-231\"]"
    }).optional(),
    branch: z.string().min(1).openapi({
        description: 'Branch name',
        example: 'master'
    }),
    viewport: z.string().min(1).openapi({
        description: 'Viewport size',
        example: '1366x768'
    }),
    browser: z.string().min(1).openapi({
        description: 'Browser name',
        example: 'chrome'
    }),
    browserVersion: z.string().min(1).openapi({
        description: 'Browser version',
        example: '125'
    }),
    browserFullVersion: z.string().min(1).openapi({
        description: 'Browser full version',
        example: '125.12.56.001'
    }).optional(),
    os: z.string().min(1).openapi({
        description: 'Operating system',
        example: 'macOS'
    }),
    run: z.string().min(1).openapi({
        description: 'Run name',
        example: 'Build #123'
    }),
    runident: z.string().min(1).openapi({
        description: 'Run identifier',
        example: '978ee42c-78f8-40f4-8954-51ebc08d1718'
    }),
    suite: z.string().min(1).openapi({
        description: 'Suite name',
        example: 'Smoke tests'
    })
});

export type ClientStartSessionType = z.infer<typeof ClientStartSessionSchema>

const ClientStartSessionResponseSchema = z.object({
    name: z.string().openapi({
        description: 'Name of the session',
        example: 'Login test'
    }),
    status: z.string().openapi({
        description: 'Status of the session',
        example: 'Running'
    }),
    browserName: z.string().openapi({
        description: 'Browser name',
        example: 'chrome'
    }),
    browserVersion: z.string().openapi({
        description: 'Browser version',
        example: '125'
    }),
    branch: z.string().openapi({
        description: 'Branch name',
        example: 'master'
    }),
    tags: z.array(z.string()).openapi({
        description: 'Tags associated with the session',
        example: ['@smoke', '@PJ-231']
    }),
    viewport: z.string().openapi({
        description: 'Viewport size',
        example: '1366x768'
    }),
    os: z.string().openapi({
        description: 'Operating system',
        example: 'macOS'
    }),
    app: z.string().openapi({
        description: 'Application identifier',
        example: '666b3b82db17d34ecdbd06f6'
    }),
    blinking: z.number().openapi({
        description: 'Blinking count',
        example: 0
    }),
    updatedDate: z.string().openapi({
        description: 'Last updated date',
        example: '2024-06-13T18:34:28.121Z'
    }),
    startDate: z.string().openapi({
        description: 'Start date of the session',
        example: '2024-06-13T18:34:28.121Z'
    }),
    checks: z.array(z.any()).openapi({
        description: 'Checks associated with the session',
        example: []
    }),
    suite: z.string().openapi({
        description: 'Suite identifier',
        example: '666b3b828833d0cf24a670d7'
    }),
    run: z.string().openapi({
        description: 'Run identifier',
        example: '666b244a70a6fb0a4368b59e'
    }),
    _id: commonValidations.id.openapi({
        description: 'Identifier of the session',
        example: '666b3bb49e0c25666d76e0c4'
    }),
    id: commonValidations.id.openapi({
        description: 'Identifier of the session',
        example: '666b3bb49e0c25666d76e0c4'
    })
});

const ClientEndSessionSchema = z.object({
    testid: commonValidations.id
});

const ClientCreateCheckSchema = z.object({
    testid: commonValidations.id.openapi({
        description: 'Test identifier',
        example: '666b2e1e93ca920ef5985b47'
    }),
    name: z.string().openapi({
        description: 'Name of the check',
        example: 'Login page'
    }),
    appName: z.string().openapi({
        description: 'Application name',
        example: 'My App'
    }),
    branch: z.string().openapi({
        description: 'Branch name',
        example: 'master'
    }),
    suitename: z.string().openapi({
        description: 'Suite name',
        example: 'Smoke tests'
    }),
    viewport: z.string().openapi({
        description: 'Viewport size',
        example: '1366x768'
    }),
    browserName: z.string().openapi({
        description: 'Browser name',
        example: 'chrome'
    }),
    browserVersion: z.string().openapi({
        description: 'Browser version',
        example: '125'
    }),
    browserFullVersion: z.string().openapi({
        description: 'Full browser version',
        example: '125.0.6422.142'
    }),
    os: z.string().openapi({
        description: 'Operating system',
        example: 'macOS'
    }),
    hashcode: z.string().openapi({
        description: 'Hash of the snapshot - In the first phase, only the hash is sent, in case the snapshot is already in the Syngrisi database',
        example: 'ef6ff7c6e6fd536de877c02cf61381e5a1111a24c9d21c1c2a0c0c06fdd2f01271da8880da80a1caa7c123ce3256068c40055753d70bd1dbc558d088f90cd398'
    })
});

const SnapshotSchema = z.object({
    name: z.string().openapi({
        description: 'Name of the snapshot',
        example: 'Login page'
    }),
    filename: z.string().openapi({
        description: 'Filename of the snapshot',
        example: '666b12d859ac872b495af4b0.png'
    }),
    imghash: z.string().openapi({
        description: 'Image hash of the snapshot',
        example: 'ef6ff7c6e6fd536de877c02cf61381e5a1111a24c9d21c1c2a0c0c06fdd2f01271da8880da80a1caa7c123ce3256068c40055753d70bd1dbc558d088f90cd398'
    }),
    _id: commonValidations.id.openapi({
        description: 'Identifier of the snapshot',
        example: '666b4ebc421977cbf466b478'
    }),
    createdDate: z.string().openapi({
        description: 'Creation date',
        example: '2024-06-13T19:55:40.068Z'
    }),
    id: commonValidations.id.openapi({
        description: 'Identifier of the snapshot',
        example: '666b4ebc421977cbf466b478'
    })
});

const ClientCreateCheckResponseSchema = z.object({
    name: z.string().openapi({
        description: 'Name of the check',
        example: 'Login page'
    }),
    test: commonValidations.id.openapi({
        description: 'Test identifier',
        example: '666b4e74421977cbf466b446'
    }),
    suite: commonValidations.id.openapi({
        description: 'Suite identifier',
        example: '666b3b828833d0cf24a670d7'
    }),
    app: commonValidations.id.openapi({
        description: 'Application identifier',
        example: '6651dd45b9c3e1e0b8c1ce26'
    }),
    branch: z.string().openapi({
        description: 'Branch name',
        example: 'master'
    }),
    baselineId: commonValidations.id.openapi({
        description: 'Baseline identifier',
        example: '666b4ebc421977cbf466b478'
    }),
    actualSnapshotId: commonValidations.id.openapi({
        description: 'Actual snapshot identifier',
        example: '666b4ebc421977cbf466b478'
    }),
    updatedDate: z.string().openapi({
        description: 'Last updated date',
        example: '2024-06-13T19:55:40.061Z'
    }),
    status: z.array(z.string()).openapi({
        description: 'Status of the check',
        example: ['new']
    }),
    browserName: z.string().openapi({
        description: 'Browser name',
        example: 'chrome'
    }),
    browserVersion: z.string().openapi({
        description: 'Browser version',
        example: '125'
    }),
    browserFullVersion: z.string().openapi({
        description: 'Full browser version',
        example: '125.0.6422.142'
    }),
    viewport: z.string().openapi({
        description: 'Viewport size',
        example: '1366x768'
    }),
    os: z.string().openapi({
        description: 'Operating system',
        example: 'macOS'
    }),
    result: z.string().openapi({
        description: 'Result of the check',
        example: '{}'
    }),
    run: commonValidations.id.openapi({
        description: 'Run identifier',
        example: '666b4e74421977cbf466b443'
    }),
    creatorId: commonValidations.id.openapi({
        description: 'Creator identifier',
        example: '66519e582c2c701cc438ce59'
    }),
    creatorUsername: z.string().openapi({
        description: 'Creator username',
        example: 'Guest'
    }),
    failReasons: z.array(z.any()).openapi({
        description: 'Reasons for failure',
        example: []
    }),
    _id: commonValidations.id.openapi({
        description: 'Identifier of the check',
        example: '666b4ebc421977cbf466b47c'
    }),
    createdDate: z.string().openapi({
        description: 'Creation date',
        example: '2024-06-13T19:55:40.082Z'
    }),
    currentSnapshot: SnapshotSchema,
    expectedSnapshot: SnapshotSchema,
    lastSuccess: commonValidations.id.openapi({
        description: 'Identifier of the last successful check',
        example: '666b4ebc421977cbf466b47c'
    })
});

const ClientGetIdentSchema = z.array(z.string()).openapi({
    description: "Set of fields that identify checks and baselines",
    example: ['name', 'viewport', 'browserName', 'os', 'app', 'branch']
});

const ClientGetBaselinesSchema = z.object({
    baselines: z.array(z.object({
        id: commonValidations.id,
        name: z.string().openapi({
            description: 'Name of the baseline',
            example: 'A-A-A'
        }),
        app: commonValidations.id.openapi({
            description: 'Application identifier',
            example: '6651dd45b9c3e1e0b8c1ce26'
        }),
        branch: z.string().openapi({
            description: 'Branch name',
            example: 'master'
        }),
        browserName: z.string().openapi({
            description: 'Browser name',
            example: 'chrome'
        }),
        viewport: z.string().openapi({
            description: 'Viewport size',
            example: '1366x768'
        }),
        os: z.string().openapi({
            description: 'Operating system',
            example: 'macOS'
        }),
        createdDate: z.string().openapi({
            description: 'Creation date',
            example: '2024-06-13T15:59:44.479Z'
        }),
        lastMarkedDate: z.string().openapi({
            description: 'Last marked date',
            example: '2024-06-13T15:59:44.381Z'
        }),
        markedAs: z.string().openapi({
            description: 'Marked status',
            example: 'accepted'
        }),
        markedById: commonValidations.id.openapi({
            description: 'Identifier of the user who marked the baseline',
            example: '66519e1682764a892a1a0031'
        }),
        markedByUsername: z.string().openapi({
            description: 'Username of the user who marked the baseline',
            example: 'Administrator'
        }),
        snapshootId: commonValidations.id.openapi({
            description: 'Snapshot identifier',
            example: '666b12d859ac872b495af4b0'
        }),
        _id: commonValidations.id.openapi({
            description: 'Identifier of the baseline',
            example: '666b177059ac872b495af63d'
        })
    }))
});

const ClientGetSnapshotsSchema = z.object({
    snapshots: z.array(z.object({
        id: commonValidations.id,
        name: z.string()
    }))
});

export {
    ClientStartSessionSchema,
    ClientStartSessionResponseSchema,
    ClientEndSessionSchema,
    ClientCreateCheckSchema,
    ClientGetIdentSchema,
    ClientGetBaselinesSchema,
    ClientGetSnapshotsSchema,
    ClientCreateCheckResponseSchema
};
