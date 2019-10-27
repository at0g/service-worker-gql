import React from 'react'

export default function DumpJSON(props) {
    return (
        <code>
            <pre>{JSON.stringify(props, null, 2)}</pre>
        </code>
    )
}
