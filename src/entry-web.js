import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import App from './App'

const container = document.getElementById('appContainer')

const el = <App
    history={createBrowserHistory()}
/>

ReactDOM.render(el, container, () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.info('ServiceWorker registration successful with scope: ', registration.scope);
                }, (err) => {
                    console.warn('ServiceWorker registration failed: ', err);
                });
        })
    }
})
