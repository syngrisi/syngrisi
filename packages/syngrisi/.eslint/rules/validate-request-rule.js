module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ensure validateRequest middleware is used in router methods",
            category: "Best Practices",
            recommended: true
        },
        schema: [] // no options
    },
    create(context) {
        return {
            // // Handle direct method calls on router
            // "CallExpression[callee.object.name='router'][callee.property.name=/^(get|post|patch|delete)$/]": checkMiddleware,
            // // Handle method calls following router.route()
            // "CallExpression[callee.object.callee.property.name='route'][callee.property.name=/^(get|post|patch|delete)$/]": checkMiddleware,
            "[callee.property.name=/^(get|post|patch|delete)$/]": checkMiddleware,
        };

        function checkMiddleware(node) {
            const hasValidateRequest = node.arguments.some(arg => {
                return (
                    (arg.type === 'CallExpression' && arg.callee.name === 'validateRequest') ||
                    (arg.type === 'Identifier' && arg.name === 'validateRequest')
                );
            });

            if (!hasValidateRequest) {
                context.report({
                    node,
                    message: "The validateRequest middleware must be used in router methods."
                });
            }
        }
    }
};
