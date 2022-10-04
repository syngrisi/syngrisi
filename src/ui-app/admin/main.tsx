import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { parse, stringify } from 'query-string';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
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
    </React.StrictMode>,
);
