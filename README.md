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

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Continuous Delivery

Each commit on the `main` branch is deployed to [staging.presentium.ch](https://staging.presentium.ch)
using GitHub Actions, to a dedicated namespace on the Cloud infrastructure.

The `production` branch is the one that will be automatically deployed to [app.presentium.ch](https://app.presentium.ch).

The default branch therefore is `main`, and the `production` branch is protected.
When a change is ready to be deployed, a pull request should be made from `main` to `production`.

## Contributing

Please refer to the [Contributing Guide][contributing] before making a pull request.

[contributing]: https://github.com/presentium/meta/blob/main/CONTRIBUTING.md
