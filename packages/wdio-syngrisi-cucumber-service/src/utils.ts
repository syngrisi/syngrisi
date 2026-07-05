const { faker } = require('@faker-js/faker');

module.exports = {
    generateRunName: () => faker.lorem.sentence(4)
        .replace('.', ''),
    generateRunIdent: () => faker.string.uuid(),
};
