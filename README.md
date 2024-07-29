# Presentium - Dashboard

This is the main frontend app for Presentium, available at [app.presentium.ch](https://app.presentium.ch).
It is based on [Nuxt UI Pro](https://ui.nuxt.com/pro) and [Tailwind CSS](https://tailwindcss.com/).

## Stack

- [Typescript](https://www.typescriptlang.org/)
- [Nuxt 3](https://nuxt.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Nuxt UI](https://ui.nuxt.com/)

Make sure to install the dependencies:

```bash
npm install
```

## Development

### Local Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

### Development tips

#### Local environment variables

Make a copy of `.env.example` and name it `.env`. This file is ignored by git and should contain the environment
variables that are specific to your local development environment.

Here are a description of the variables you can set. Note that defaults to get you up and running are already provided.

| Variable                           | Description                                                      |
| ---------------------------------- | ---------------------------------------------------------------- |
| `NUXT_PUBLIC_SITE_URL`             | The public URL of the application, used for OIDC redirect URI.   |
| `API_URL`                          | The URL of the API to use. Defaults to `http://localhost:13000`. |
| `AUTH_OIDC_PROVIDER_AUTHORIZE_URL` | The authorize endpoint of the OIDC provider                      |
| `AUTH_OIDC_PROVIDER_TOKEN_URL`     | The token endpoint of the OIDC provider                          |
| `AUTH_OIDC_PROVIDER_USERINFO_URL`  | The userinfo endpoint of the OIDC provider                       |
| `AUTH_OIDC_PROVIDER_LOGOUT_URL`    | The logout endpoint of the OIDC provider                         |
| `AUTH_OIDC_PROVIDER_CLIENT_ID`     | The client ID of the OIDC provider                               |
| `AUTH_OIDC_PROVIDER_CLIENT_SECRET` | The client secret of the OIDC provider                           |

#### Running with the API

Most of the features of the dashboard require the API to be running. You can run the API locally by following the
instructions in the [API repository](https://github.com/presentium/api). When running in development mode, the API
will also start a mock OIDC provider that will give you a couple of users you can use to log in with different roles.

## Continuous Delivery

Each commit on the `main` branch is deployed to [staging.presentium.ch](https://staging.presentium.ch)
using GitHub Actions, to a dedicated namespace on the Cloud infrastructure.

The default branch therefore is `main` and it is protected. When a change is ready to be deployed,
the deployment workflow should be triggered manually providing the desired version number.

## Contributing

Please refer to the [Contributing Guide][contributing] before making a pull request.

[contributing]: https://github.com/presentium/meta/blob/main/CONTRIBUTING.md
