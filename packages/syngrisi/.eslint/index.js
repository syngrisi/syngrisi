module.exports = {
    rules: {
      'test-rule': require('./rules/test-rule'),
      'validate-request-rule': require('./rules/validate-request-rule'),
      'check-route-registration': require('./rules/check-route-registration')
    }
  }