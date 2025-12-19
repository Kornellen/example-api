import { Express } from "express";
import { getLocalAddress } from "../env/getLocalAddress";

export interface IServerManager {
  initialize(app: Express, port: number, cert?: SSLType): void;
}

export function generateServerMessage(type: "HTTP" | "HTTPS", port: number) {
  const addresses = getLocalAddress()
    .map((address) => `${address}:${port}`.underline.yellow)
    .join(" OR ");

  console.log(`${type} Server can be reached on: ${addresses}`);
}
