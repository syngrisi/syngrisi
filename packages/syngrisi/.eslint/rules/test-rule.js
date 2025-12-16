module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "disallow the word 'test' in comments",
            category: "Best Practices",
            recommended: false
        },
        schema: [] // This rule does not accept any options
    },
    create: function(context) {
        const sourceCode = context.getSourceCode();

        return {
            Program() {
                const comments = sourceCode.getAllComments();

                comments.forEach(comment => {
                    const hasTestWord = /test/i.test(comment.value);
                    if (hasTestWord) {
                        context.report({
                            node: comment,
                            message: "The word 'test' is not allowed in comments."
                        });
                    }
                });
            }
        };
    }
};
