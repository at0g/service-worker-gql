import { useCallback, useEffect, useState } from 'react'

export default function useRouteAction(router, history) {
    const [action, setAction] = useState()
    const resolveRoute = useCallback(location =>
            router.resolve({ ...location, history })
                .then((action) => {
                    setAction(action)
                    return action
                }),
    [history, setAction]
    )

    useEffect(() => {
        resolveRoute(history.location)
            .catch(err => {
                console.error(err.message)
            })
        const unlisten = history.listen(resolveRoute)
        return unlisten
    }, [history, resolveRoute])

    return action
}
