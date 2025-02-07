# Fetch Dog Rescue

Take home assessment for Fetch Rewards. Requirements can be found [here](https://frontend-take-home.fetch.com/)

Deployed at <https://fetch-doggie-rescue.netlify.app/>

## Library and Tools

- [React](https://react.dev/)
- [Vite](https://vite.dev/guide/)
- [Mantine](https://mantine.dev/)
- [Zod](https://zod.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## Approach

Because the Fetch API uses httpOnly cookies for authentication, I decided to make all requests on the client and thusly opted to make this app an SPA.

The alternative would have been to use a SSR/SSG framework such as Next.js or Astro. The problem with either of those solutions lie within how the credential cookies are handled.

In a SPA app, the user's browser is hitting the Fetch API, which returns a response with the credential cookies and appropriate headers. All subsequent requests will contain the credentials, which the Fetch API verifies.

With the alternative solutions, the requests would have been made server-side (through a server action or Astro action). Because RESTful principles require the server to be stateless, all subsequent requests would have incorrect/missing credentials and the Fetch API would have denied it. The solution would have been to create some sort of server-side session, but that would have made me extend beyond the time restraints of this project.
