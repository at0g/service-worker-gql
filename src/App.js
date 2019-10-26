import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react'
import { hot } from 'react-hot-loader/root'
import { ApolloProvider } from '@apollo/react-hooks'
import UniversalRouter from 'universal-router'
import defaultRoutes from './routes'
import { useRouteAction, useOffline } from './hooks'

function App(props) {
    const {
        apolloClient,
        history,
        initialView = null,
        routes = defaultRoutes,
    } = props

    const offline = useOffline()
    const router = useMemo(() => new UniversalRouter(routes), [
        UniversalRouter,
        routes,
    ])
    const action = useRouteAction(router, history)

    return (
        <ApolloProvider client={apolloClient}>
            <main>
                <h1>App shell root {offline && <>(Offline)</>}</h1>
                <section>
                    <header>
                        <h2>Rendered route</h2>
                    </header>
                    {!action && initialView}
                    {action && action.Component && <action.Component />}
                </section>
            </main>
        </ApolloProvider>
    )
}

export default hot(App)
