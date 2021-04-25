import React from 'react';
import { render } from 'react-dom'
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './app';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux'
import store from './store'

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
	
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
