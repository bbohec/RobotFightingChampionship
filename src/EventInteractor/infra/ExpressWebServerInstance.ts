import { Express } from 'express'
import { Server } from 'http'
import { serverListeningMessage } from './WebServerEventInteractor'

export class ExpressWebServerInstance {
    constructor (instance: Express, port: number) {
        this.port = port
        this.instance = instance
    }

    start () {
        this.server = this.instance.listen(this.port, () => console.log(serverListeningMessage(this.port)))
    }

    close () {
        if (this.server)
            this.server.close(error => {
                if (error)
                    throw error
            })
    }

    readonly instance: Express;
    readonly port: number;
    private server: Server | undefined;
}
