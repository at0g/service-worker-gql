import React, { useMemo } from 'react'
import { hot } from 'react-hot-loader/root'
import { ApolloProvider } from '@apollo/react-hooks'
import UniversalRouter from 'universal-router'
import defaultRoutes from './routes'
import { useRouteAction, useOffline } from './hooks'
import HistoryContext from './context/HistoryContext'
import Link from './components/Link'

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
        <HistoryContext.Provider value={history}>
            <ApolloProvider client={apolloClient}>
                <main>
                    <h1>App shell root {offline && <>(Offline)</>}</h1>
                    <nav>
                        <Link href='/'>Home</Link>&nbsp;|&nbsp;
                        <Link href='/pokemons'>Pokemons</Link>
                    </nav>
                    <section>
                        <header>
                            <h2>Rendered route</h2>
                        </header>
                        {!action && initialView}
                        {action && action.Component && <action.Component />}
                    </section>
                </main>
            </ApolloProvider>
        </HistoryContext.Provider>
    )
}

export default hot(App)
