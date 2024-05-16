# Connect-Five Monorepo

This is the monorepo for the connect-five game.

Some key things:

- We use `turbo` to manage the monorepo.
- We use `yarn` as the package manager.
- Typescript front-end.
- Typescript back-end.
- NextJS for the front-end.
- NestJS for the back-end.
- Websockets for realtime.

# Backend Development Setup

Run the following:

```
cd services/game-server
cp .env.sample .env
```

To run a backend locally, you'll need to authenticate with Firebase. See
[this link](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments) for
authenticating in non-Google (local) environments.

Generate a new private key, place the json file somewhere on your machine, and
assign the `GOOGLE_APPLICATION_CREDENTIALS` env variable to the file path for
the json file.
