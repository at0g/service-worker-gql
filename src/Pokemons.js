import React from 'react'
import { useQuery } from '@apollo/react-hooks';
import GetPokemons from './GetPokemons.graphql'

const style = { display: 'inline-block', width: '300px', height: '300px', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: '50% 50%'}

export default function Pokemons() {
    const { loading, error, data } = useQuery(GetPokemons,{
        variables: {
            first: 50
        }
    })
    return (
        <>
            {!!loading && 'Loading'}
            {!loading && error && (
                <code><pre>{JSON.stringify(error, null, 2)}</pre></code>
            )}
            <h5>Data</h5>
            {/*<code><pre>{JSON.stringify(data, null, 2)}</pre></code>*/}


            {!!data && data.pokemons.map((o) => {
                return (
                    <div
                        key={o.id}
                        style={{ ...style, backgroundImage: `url("${o.image}")` }}
                    />
                )
            })}
        </>
    )
}
