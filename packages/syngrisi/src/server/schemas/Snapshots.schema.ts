import { z } from 'zod';
import { commonValidations } from './utils';

const SnapshotsResponseSchema = z.array(
    z.object({
        _id: commonValidations.id,
        name: z.string().min(1).openapi({
            description: 'Name of the snapshot',
            example: 'Login page'
        }),
        filename: z.string().min(1).openapi({
            description: 'Filename of the snapshot',
            example: '6651dd4f7c9186e315910b24.png'
        }),
        imghash: z.string().min(1).openapi({
            description: 'Image hash of the snapshot',
            example: '96e8359554f12142bc19e44288295aa67a59cd128e242b6756651bf8e3d9f34caa7f587367ca8e5cdcfbaaf180adfd8825250fc7485784c41de11a9c08c1f9ab'
        }),
        createdDate: z.string().datetime().openapi({
            description: 'Creation date of the snapshot',
            example: '2024-05-25T13:15:30.946Z'
        }),
        id: commonValidations.id.openapi({
            description: 'Snapshot identifier',
            example: '6651e47285f83573a821d20e'
        }),
    })
);

export { SnapshotsResponseSchema };
