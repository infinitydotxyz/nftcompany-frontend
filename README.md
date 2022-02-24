## Getting Started

First, install the packages:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Routes not live yet - Ignore below

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Using the Debugger

- The debugger can be connected in one of two modes `launch` or `attach`

  - Use `attach` if you actively use chrome as your main browser
  - Only use `launch` if you mainly use a different browser and only use chrome for development. Otherwise the `userDataDir` setting - which allows you to launch the browser with your metamask - will prevent the browser from being launched correctly

- `attach`
  - Start the server `npm run dev`
  - Start chrome and pass the remote debugging port flag
    - On mac: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222`
  - Navigate to localhost:3000 in the window that opens
  - Open the Command Palette (⇧⌘P), select Debug: Select and Start Debugging, select `dev-attach`
- `launch`
  - Start the server `npm run dev`
  - Make sure chrome is closed
  - Open the Command Palette (⇧⌘P), select Debug: Select and Start Debugging, select `dev-launch`
