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
        const filename = context.getFilename();
        
        if (!filename.endsWith('route.ts')) {
            return {};
        }

        return {
            "[callee.property.name=/^(get|post|patch|delete|put)$/]": checkMiddleware,
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
