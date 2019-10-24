import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
        history,
        initialView = null,
        routes = defaultRoutes
    } = props;
    const [component, setView] = useState(initialView)
    const [online, setOnline] = useState(getOnline())
    const router = useMemo(() => new UniversalRouter(routes), [
        UniversalRouter,
        routes,
    ]);

    const resolveRoute = useCallback(location => router
        .resolve({ ...location, history })
        .then(action => {
            setView(action.component)
        })
    , [history, setView])

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
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
    }, [])

    return (
        <main>
            Here's the app shell {!online && <>(Offline)</>}<br />
            {component}
        </main>
    )
}
