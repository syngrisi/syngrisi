import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { parse, stringify } from 'query-string';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@shared/components/errors/ErrorFallback';

import App from '@index/App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // reset the state of your app so the error doesn't happen again
            }}
        >
            <BrowserRouter>
                <QueryParamProvider
                    adapter={ReactRouter6Adapter}
                    options={{
                        searchStringToObject: parse,
                        objectToSearchString: stringify,
                    }}
                >
                    <App />
                </QueryParamProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>,
);
