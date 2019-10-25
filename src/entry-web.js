import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http'
import App from './App'

const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({
        credentials: 'omit'
    })
})
const history = createBrowserHistory()

const container = document.getElementById('appContainer')

const el = <App { ...{ apolloClient, history } } />

ReactDOM.render(el, container, afterRender)

function afterRender() {
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
}
