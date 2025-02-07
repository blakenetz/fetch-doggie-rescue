# Fetch Dog Rescue

Take home assessment for Fetch Rewards. Requirements can be found [here](https://frontend-take-home.fetch.com/).

Deployed at <https://fetch-doggie-rescue.netlify.app>

This app was bootstrapped with `vite create --template react-ts`, and follows all the patterns set by Vite.

## Scripts and Installation

This is a straightforward Vite React app, so expect all the standard Vite run commands. You'll notice a `bun.lock` file because I used [Bun](https://bun.sh/) for my tooling, but use whatever package manager tickles your fancy.

```bash
$ bun|yarn|pnpm|npm install
```

- `dev`: Start Vite development server
- `build`: Compile Typescript files, and then build with Vite
- `lint`: Lint with Eslint
- `preview`: Preview the production build

## Library and Tools

- [React](https://react.dev/)
- [Vite](https://vite.dev/guide/)
- [Mantine](https://mantine.dev/)
- [Zod](https://zod.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## Approach

### Authentication

Because the Fetch API uses httpOnly cookies for authentication, I decided to make all requests on the client and thusly opted to make this app an SPA.

The alternative would have been to use a SSR/SSG framework such as Next.js or Astro. The problem with either of those solutions is how the credential cookies are handled.

In a SPA app, the user's browser is hitting the Fetch API, which returns a response with the credential cookies and appropriate headers. All subsequent requests will contain the credentials, which the Fetch API verifies.

With the alternative solutions, the requests would have been made server-side (through a server action or Astro action). Because RESTful principles require the server to be stateless, all subsequent requests would have incorrect/missing credentials and the Fetch API would have denied it. The solution would have been to create some sort of server-side session, but tbh that would have been way to time intensive for this project.

### Styles

In an effort to keep things simple, I opted to only utilize a UI component library without any further CSS. The library I used utilizes inline styles, stylesheet injection, and css modules. A better solution would have been to use component-scoped css modules, but I wanted to reduce the amount of files and wasn't too concerned with scaling. The problem with my approach is doesn't really allow for cascading or shared styles. And it makes the component files a little more busy with all the styling props

### Data Fetching

All API calls are made in the `actions` directory and are facilitated with the native [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) module.

Every fetch function does one of two things: return the resolved data if the response status is `200`, or throws either the response or error. There is a single function in the [AppContext](./src/context/AppProvider.tsx) that handles all errors. In almost all cases, I display some sort of messaging to the user.

If the error is of type `Response`, it will unset the authentication state if the status is `401`, otherwise it will display the status code and message as an alert.

If the error is of type `Error`, it will display the error message is an alert.

Otherwise, we display a generic message as an alert.

### Validation

Any/All validation is done with Zod. The forms were simple enough where Zod was the quick and easy solution. Plus, I see Zod everywhere, so I figure it's an industry standard at this point.

### Optimizations

This project uses the [React Compiler](https://react.dev/learn/react-compiler), so I wasn't too concerned about any memoization strategies.

The background image is set in the `index.html`, so the user doesn't have to look at a blank page will React boots up.

## Realistic Next Steps

I would have liked to implement an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to stop in-flight requests when a new one is made.

I'm also not touching the `/location/` endpoint. I guess I could have utilized it either for dog filtering or expanding on the location data of each dog (currently it's limited to the `zip_code`), but I didn't want this project to balloon, so I focused on a quality MVP instead.

IMHO the footer is a bit of a mess on mobile viewports because I opted for a single layout. I also wanted to keep this a single page (i.e. without a router), so I just crammed as much stuff in the view as possible, which means a heavy reliance on modals.
