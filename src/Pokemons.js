import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'
import GetPokemons from './GetPokemons.graphql'
import DumpJSON from './components/DumpJSON'
import Link from './components/Link'
import PokemonSummary from './components/PokemonSummary'

const Container = styled.div`
    display: block;
    margin: 0 auto;
    width: 930px;
`

const PokemonsGrid = styled.section`
    display: grid;
    grid-template-columns: repeat(3, 300px);
    grid-template-rows: repeat(${props => props.rows}, 300px);
    grid-gap: 10px;
`

const PokemonsGridItem = styled(Link)`
    grid-column-start: auto;
    grid-row-start: auto;
`

export default function Pokemons() {
    const { loading, error, data } = useQuery(GetPokemons, {
        variables: {
            first: 180,
        },
    })
    return (
        <Container>
            {!!loading && 'Loading'}
            {!loading && error && <DumpJSON {...error} />}
            {!!data && (
                <PokemonsGrid rows={Math.ceil(data.pokemons.length / 3)}>
                    {data.pokemons.map((o, index) => (
                        <PokemonsGridItem
                            index={index}
                            key={o.id}
                            href={`/pokemon/${o.id}`}
                        >
                            <PokemonSummary {...o} />
                        </PokemonsGridItem>
                    ))}
                </PokemonsGrid>
            )}
        </Container>
    )
}
