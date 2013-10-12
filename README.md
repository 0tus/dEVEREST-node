# Dam Webapp Node API

This is a simple node restful API for webapp development

For the time being, data is stored in a javascript object (a simple hash) and
when modified, also stored in a JSON file in `/tmp/dev_database.json`.
This way it is possible to restart the server without loosing the data.

Later REDIS and/or MongoDB connectors should be added.

## Installation

    npm install

## Configuration

In the `config.js`, you can:

- `port`. Choose the port of the Node JS server. Default is 3000
- `databaseConnector`. Choose the database connector. For the time being there
  is only one: the bare connector.
- `ressources`. Choose the ressources you want to expose.
- `apiRouteNamespace`. You can namespace the api route. The route can be
  `/api/photos` but photos ressources will be stored under the `/photos`
  namespace in the JSON.

## Launch the server

    node app.js

## API principle

The API makes the assumption that you can only perform six different operations
on a ressource (actually a collection of individual ressources).
For example with the `api` namespace and the `photos` ressource:

| HTTP Verb (action)  | Collection    | Ressource         |
|---------------------|---------------|-------------------|
| GET (read)          | `/api/photos` | `/api/photos/:id` |
| POST (create)       | Impossible    | `/api/photos`     |
| PUT (update)        | Impossible    | `/api/photos/:id` |
| DELETE (delete)     | `/api/photos` | `/api/photos/:id` |

