import { z } from 'zod';
import { commonValidations } from './utils';

const SettingsGetSchema = z.object({
    name: z.string().min(1).openapi({
        description: 'Name of the setting',
        example: 'example_setting'
    }),
    value: z.any().openapi({
        description: 'Value of the setting',
        example: 'example_value'
    }),
    description: z.string().optional().openapi({
        description: 'Description of the setting',
        example: 'This is an example setting.'
    }),
});

const SettingsUpdateSchema = z.object({
    value: z.any().openapi({
        description: 'New value for the setting',
        example: 'new_example_value'
    }),
    enabled: z.boolean().optional().openapi({
        description: 'Enable or disable the setting',
        example: true
    }),
});

const SettingsResponseSchema = z.array(
    z.object({
        _id: commonValidations.id,
        name: z.string().min(1).openapi({
            description: 'Name of the setting',
            example: 'first_run'
        }),
        label: z.string().min(1).openapi({
            description: 'Label of the setting',
            example: 'First Run'
        }),
        description: z.string().min(1).openapi({
            description: 'Description of the setting',
            example: 'Indicates if the application is running the first time'
        }),
        type: z.string().min(1).openapi({
            description: 'Type of the setting',
            example: 'Boolean'
        }),
        value: z.any().openapi({
            description: 'Value of the setting',
            example: false
        }),
        enabled: z.boolean().openapi({
            description: 'Indicates if the setting is enabled',
            example: true
        }),
        __v: z.number().openapi({
            description: 'Version key',
            example: 0
        }),
    })
);

const SettingsNameParamSchema = z.object({
    name: z.string().min(1).openapi({
        description: 'Name of the setting to update',
        example: 'example_setting'
    }),
});

export { SettingsGetSchema, SettingsUpdateSchema, SettingsNameParamSchema, SettingsResponseSchema };
