import React from 'react'
import styled from 'styled-components'

const Card = styled.div`
    background-color: white; 
    box-shadow: 0 0 3px 0 rgba(0,0,0,0.2);
    display: block;
    padding: 5px;
    position: relative;
`

const Image = styled.img`
    object-fit: contain;
    width: 100%;
    height: 100%;
`

const Name = styled.div`
    position: absolute;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,0.75);
    text-align: center;
    font-family: sans-serif;
    text-transform: uppercase;
    color: cornsilk;
    font-weight: 300;
    padding: 7px 10px;
`

export default function PokemonSummary(props) {
    const { image, name } = props
    return (
        <Card>
            <Image alt={`image of ${name}`} src={image} />
            <Name>{name}</Name>
        </Card>
    )
}
