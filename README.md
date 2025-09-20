# Tech Touchdown

The repository for the code implemented during the CascadiaJS Hackathon.

## Repository Structure

`react-vite` - Static React website, bundled with Vite & using TypeSript. Styled with Tailwind.

- Install with `npm install`
- Run dev server with `npm run dev`
- Build bundle with `npm run build`

`node-service` - Express.js HTTP server, using TypeScript. Includes EXA API integration for sourcing internet data.

- Install with `npm install`
- Convert `env.example` into `.env` and populate environment variables.
- `npm run build` to build the JavaScript files for execution within the `dist` folder
- `npm start` runs the built JS files in the `dist` folder.
