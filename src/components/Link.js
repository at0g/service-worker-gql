import React, { useCallback, useContext } from 'react'
import HistoryContext from '../context/HistoryContext'

export default function Link(props) {
    const { method = 'push', ...rest } = props
    const history = useContext(HistoryContext)
    const handleClick = useCallback(
        evt => {
            evt.preventDefault()
            history[method](evt.currentTarget.getAttribute('href'))
        },
        [history, method]
    )

    return React.createElement('a', {
        ...rest,
        onClick: handleClick,
    })
}
