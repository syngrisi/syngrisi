import { faker } from '@faker-js/faker';

export const generateRunName = () => faker.lorem.sentence(4)
    .replace('.', '');
export const generateRunIdent = () => faker.string.uuid();
