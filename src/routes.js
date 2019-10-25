import React from 'react'
import { isValidElementType } from 'react-is'

const routes = [
    {
        path: '',
        action: ({ next }) => next()
            .then(action => {
                const child = React.createElement(isValidElementType(action) ? action : action.component)

                return {
                    ...action,
                    component: () => (
                        <main data-component-id='routes-root'>
                            {child}
                        </main>
                    )
                }
            }),
        children: [
            {
                path: '/',
                action: () => import(/* webpackChunkName: 'home' */'./Home.js')
                    .then(module => module.default)
            },
            {
                path: '/app-shell',
                action: () => () => <div>App shell</div>
            },
            {
                path: '/pokemons',
                action: () => import(/* webpackChunkName: 'Pokemons' */'./Pokemons.js')
                    .then(module => module.default)
                    .catch((err) => {
                        console.error(err)
                        throw err;
                    })
            },
            {
                path: '(.*)',
                action: () => import(/* webpackChunkName: '404' */'./NotFound.js')
                    .then(module => ({
                        component: module.default,
                        statusCode: 404
                    }))
            }
        ]
    }
]

export default routes
