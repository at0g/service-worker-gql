import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import ApolloClient from 'apollo-boost';
import App from './App'

const apolloClient = new ApolloClient()
const history = createBrowserHistory()

const container = document.getElementById('appContainer')

const el = <App { ...{ apolloClient, history } } />

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
