import React from 'react'
import ReactDOM from 'react-dom/client'

import * as bootstrap from '../../node_modules/bootstrap';
import './common/scss/styles.scss';
import TooltipButton from "./TooltipButton";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <React.StrictMode>
            <TooltipButton/>
        </React.StrictMode>
);
