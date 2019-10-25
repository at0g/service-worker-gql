import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
    const [online, setOnline] = useState(getOnline())
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

    const handleOnline = useCallback(() => setOnline(true), [setOnline])
    const handleOffline = useCallback(() => setOnline(false), [setOnline])

    useEffect(() => {
        const onlineListener = window.addEventListener('online', handleOnline)
        const offlineListener = window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', onlineListener)
            window.removeEventListener('offline', offlineListener)
        }
    }, [])

    return (
        <ApolloProvider client={apolloClient}>
            <main>
                Here's the app shell {!online && <>(Offline)</>}<br />
                {component}
            </main>
        </ApolloProvider>
    )
}
