import * as https from "https";
import { generateServerMessage, IServerManager } from "./ServerManager";
import { Express } from "express";
export class HTTPSServer implements IServerManager {
  initialize(app: Express, port: number, cert: SSLType): void {
    https
      .createServer(cert, app)
      .listen(port, "0.0.0.0", () => generateServerMessage("HTTPS", port));
  }
}
