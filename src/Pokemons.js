import React from 'react'
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components'
import GetPokemons from './GetPokemons.graphql'
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
    grid-column-gap: 10px;
    grid-row-gap: 10px;
`


const PokemonsGridItem = styled(PokemonSummary)`
    grid-column-start: auto;
    grid-row-start: auto;
`

export default function Pokemons() {
    const { loading, error, data } = useQuery(GetPokemons,{
        variables: {
            first: 50
        }
    })
    return (
        <Container>
            {!!loading && 'Loading'}
            {!loading && error && (
                <code><pre>{JSON.stringify(error, null, 2)}</pre></code>
            )}
            <h5>Data</h5>

            {!!data && (
                <PokemonsGrid rows={Math.ceil(data.pokemons.length / 3)}>
                    {data.pokemons.map((o, index) => (
                        <PokemonsGridItem
                            index={index}
                            key={o.id}
                            {...o}
                        />
                    ))}
                </PokemonsGrid>
            )}
        </Container>
    )
}
