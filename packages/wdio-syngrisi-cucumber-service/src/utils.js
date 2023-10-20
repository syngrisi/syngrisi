const faker = require('faker');

module.exports = {
    generateRunName: () => faker.lorem.sentence(4)
        .replace('.', ''),
    generateRunIdent: () => faker.datatype.uuid(),
};
