import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { ApolloProvider } from '@apollo/react-hooks'
import UniversalRouter from 'universal-router'
import defaultRoutes from './routes'
import { useOffline } from './hooks'

function App(props) {
    const {
        apolloClient,
        history,
        initialComponent = null,
        routes = defaultRoutes
    } = props;
    const [component, setComponent] = useState(initialComponent)

    const router = useMemo(() => new UniversalRouter(routes), [
        UniversalRouter,
        routes,
    ]);

    const resolveRoute = useCallback(location => router
        .resolve({ ...location, history })
        .then(action => {
            setComponent(action.component)
        })
    , [history, setComponent])

    useEffect(() => {
        resolveRoute(history.location)
            .catch(err => {
                console.error(err.message)
            })
        const unlisten = history.listen(resolveRoute)
        return unlisten
    }, [history, resolveRoute])

    const offline = useOffline()

    return (
        <ApolloProvider client={apolloClient}>
            <main>
                <h1>App {offline && <>(Offline)</>}</h1>
                <section>
                    <header>
                        <h2>Rendered route</h2>
                    </header>
                    {component}
                </section>
            </main>
        </ApolloProvider>
    )
}

export default hot(App)
