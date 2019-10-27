import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'
import GetPokemon from './GetPokemon.graphql'
import DumpJSON from './components/DumpJSON'
import PokemonSummary from './components/PokemonSummary'
import {
    Icon,
    faArrowsAltV,
    faFistRaised,
    faHeart,
    faRunning,
    faWeightHanging,
} from './components/Icon'

const Layout = styled('article')`
    display: grid;
    grid-template-columns: 300px 160px 160px;
    grid-template-rows: 300px auto;
    grid-gap: 10px;
`

const Card = styled(PokemonSummary)`
    height: 100%;
`

const Stats = styled.dl`
    background-color: lightgrey;
`

function Pokemon(props) {
    const { id } = props
    const { loading, error, data } = useQuery(GetPokemon, {
        variables: { id },
    })

    const {
        pokemon: {
            classification,
            fleeRate,
            height,
            maxCP,
            maxHP,
            resistant,
            types,
            weaknesses,
            weight,
        } = {},
    } = data || {}

    return (
        <>
            {!!loading && 'Loading'}
            {!loading && error && <DumpJSON {...error} />}
            {data && (
                <Layout>
                    <Card {...data.pokemon} />
                    <Stats>
                        <dt>Max CP</dt>
                        <dd>
                            <Icon icon={faFistRaised} /> {maxCP}
                        </dd>

                        <dt>Max HP</dt>
                        <dd>
                            <Icon icon={faHeart} /> {maxHP}
                        </dd>

                        <dt>Height</dt>
                        <dd>
                            <Icon icon={faArrowsAltV} />
                            {height.minimum} - {height.maximum}
                        </dd>

                        <dt>Weight</dt>
                        <dd>
                            <Icon icon={faWeightHanging} />
                            {weight.minimum} - {weight.maximum}
                        </dd>

                        <dt>Flee rate</dt>
                        <dd>
                            <Icon icon={faRunning} /> {fleeRate}
                        </dd>
                    </Stats>

                    <Stats>
                        <dt>Classification</dt>
                        <dd>{classification}</dd>

                        <dt>Types</dt>
                        <dd>{types.join(', ')}</dd>

                        <dt>Resistant</dt>
                        <dd>{resistant.join(', ')}</dd>

                        <dt>Weaknesses</dt>
                        <dd>{weaknesses.join(', ')}</dd>
                    </Stats>

                    <DumpJSON {...data} />
                </Layout>
            )}
        </>
    )
}

export default Pokemon
