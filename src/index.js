import React from 'react';
import ReactDOM from 'react-dom';
import "react-app-polyfill/stable";
import "react-app-polyfill/ie11"; // For IE 11 support
import {Provider} from 'react-redux';

import Store from './Store/Store';
import App from './App';
import * as serviceWorker from './serviceWorker';

import "./Polyfill";
import "./index.css";




const root=(
    <Provider store={Store}>
        <App />
    </Provider>
)
ReactDOM.render(root, document.getElementById('root'));

serviceWorker.unregister();
