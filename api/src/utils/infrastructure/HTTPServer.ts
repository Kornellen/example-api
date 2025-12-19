import * as http from "http";
import { generateServerMessage, IServerManager } from "./ServerManager";
import { Express } from "express";

export class HTTPServer implements IServerManager {
  initialize(app: Express, port: number): void {
    http
      .createServer(app)
      .listen(port, "0.0.0.0", () => generateServerMessage("HTTP", port));
  }
}
