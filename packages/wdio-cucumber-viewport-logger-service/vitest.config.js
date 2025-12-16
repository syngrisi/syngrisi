const { defineConfig } = require('vitest/config')

module.exports = defineConfig({
    test: {
        include: ['tests/**/*.test.js'],
        exclude: ['node_modules'],
    },
})
