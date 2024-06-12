module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure API routes are registered in userRegistry',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [], // no options
  },
  create(context) {
    const apiCalls = new Map();
    const registeredPaths = new Map();
    let currentRoutePath = null;

    // Function to transform path with parameters
    function transformPath(path) {
      return path.replace(/\/:([^\/]+)/g, '/{$1}');
    }

    // Function to track API route call
    function trackApiRoute(node, method, path) {
      if (path) {
        path = transformPath(path);
        apiCalls.set(node, { method, path });
      }
    }

    // Function to handle route methods (get, post, patch, delete)
    function trackRouteMethod(node, method) {
      const path = node.arguments[0]?.value || currentRoutePath;
      trackApiRoute(node, method, path);
    }

    // Function to track route call
    function trackRouteCall(node) {
      if (node.arguments[0]?.value) {
        currentRoutePath = node.arguments[0].value;
      }
    }

    // Function to track path registration
    function trackRegistration(node) {
      const methodProperty = node.arguments[0]?.properties.find(
        (prop) => prop.key.name === 'method'
      );
      const pathProperty = node.arguments[0]?.properties.find(
        (prop) => prop.key.name === 'path'
      );

      if (methodProperty && pathProperty) {
        const method = methodProperty.value.value;
        const path = transformPath(pathProperty.value.value);
        if (!registeredPaths.has(method)) {
          registeredPaths.set(method, []);
        }
        registeredPaths.get(method).push(path);
      }
    }

    // Function to report unregistered paths
    function reportUnregisteredPaths() {
      apiCalls.forEach((apiCall, node) => {
        const { method, path } = apiCall;
        const paths = registeredPaths.get(method) || [];

        const isRegistered = paths.some((registeredPath) =>
          registeredPath.includes(path)
        );

        if (!isRegistered) {
          context.report({
            node,
            message: `API route '${method}:${path}' is not registered in Open API registry`,
          });
        }
      });
    }

    return {
      CallExpression(node) {
        const { callee } = node;

        // Track API route declarations for router.route().method()
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'CallExpression' &&
          callee.object.callee.type === 'MemberExpression' &&
          callee.object.callee.property.name === 'route'
        ) {
          trackRouteCall(callee.object);
          const method = callee.property.name;
          if (['get', 'post', 'patch', 'delete'].includes(method)) {
            trackRouteMethod(node, method);
          }
        }

        // Track API route declarations for router.method()
        if (
          callee.type === 'MemberExpression' &&
          callee.object.name === 'router' &&
          ['get', 'post', 'patch', 'delete'].includes(callee.property.name)
        ) {
          const method = callee.property.name;
          trackRouteMethod(node, method);
        }

        // Track path registrations
        if (
          callee.type === 'MemberExpression' &&
          callee.object.name === 'registry' &&
          callee.property.name === 'registerPath'
        ) {
          trackRegistration(node);
        }
      },
      'Program:exit'() {
        reportUnregisteredPaths();
      },
    };
  },
};
