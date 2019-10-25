import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import UniversalRouter from 'universal-router'
import defaultRoutes from './routes'

function getOnline() {
    if (typeof navigator === 'undefined') {
        return true
    }
    return navigator.onLine
}

export default function App(props) {
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

    const [offline, setOffline] = useState(false)

    if (typeof navigator !== 'undefined') {
        const handleOnline = useCallback(() => setOffline(false), [setOffline])
        const handleOffline = useCallback(() => setOffline(true), [setOffline])
        useLayoutEffect(() => {
            const onlineListener = window.addEventListener('online', handleOnline)
            const offlineListener = window.addEventListener('offline', handleOffline)
            return () => {
                window.removeEventListener('online', onlineListener)
                window.removeEventListener('offline', offlineListener)
            }
        }, [handleOnline, handleOffline])
    }



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
