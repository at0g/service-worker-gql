# GraphQL + Service worker example

## Overview

This repository contains a demo of using service worker to cache graphql queries.  
The demo is built with React, Apollo and Workbox.

## Getting started

You'll want node and npm installed to run this project locally.

A prerequisite to running this project is to run a graphql pokemon API to serve data.

### Install and run the graphql API (Prerequisite)

In a new terminal tab:

```
git clone git@github.com:lucasbento/graphql-pokemon.git
cd graphql-pokemon
npm i && npm run build && npm start
```

The above commands will install dependencies for the graphql pokemon API and start a server
listening on http://localhost:5000.
Leave this terminal tab running will working with this project.

### Install and run the demo

In a new terminal tab:

```
npm i
npm run dev
```

Once the dev server is running, you can access the site on http://localhost:8080

## What to look at?

Visit the [pokedex](http://localhost:8080/pokemons), this will make a graphql
query to /graphl (this POST request is proxied to API server by webpack-dev-server)
and the response will be persisted to indexeddb.

Once you have the list of pokemon, have a look inside your browser devtools - in chrome browser, view the
**Application** tab, then **IndexedDB** under storage. There should be _graphql_queries_ database. Have
a look inside this database, the values are the saved network requests.

From the pokedex page, clicking a pokemon will navigate to a detail page for that pokemon. Once you have viewed
a pokemon page, take another look at IndexDB - the new query should be stored in the DB.

## Service worker capabilities

Now that there cached responses in IndexDB, try going offline.
The page title will change from "App shell root" to "App shell root (Offline)"
When reloading the page while offline, the service worker will serve the stale response from the cache.
You can also try terminating the process running the API server and any cached queries will still be resolved.
