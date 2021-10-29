import express from 'express'
import { defaultHTTPWebServerPort, ExpressWebServerInstance } from './EventInteractor/infra/WebServerEventInteractor'

const webServer = new ExpressWebServerInstance(express(), defaultHTTPWebServerPort)
webServer.instance.get('/', (request, response) => {
    const html = `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <title>My First Parcel App</title>
        <link rel="stylesheet" href="../styles/styles.css" />
        <script type="module" src="../scripts/testPixiAdapter.ts"></script>
      </head>
      <body>
      </body>
    </html>
    `
    response.setHeader('Content-Type', 'text/html')
    response.render(html)
})
webServer.start()
