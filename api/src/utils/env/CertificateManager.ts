import * as path from "path";
import * as fs from "fs";
import { logger } from "../config/logger";

export class CertificatesManager {
  private static certficatesPath: string = path.resolve(
    __dirname,
    "../../../certificates"
  );

  private static get certPath(): string {
    return path.join(this.certficatesPath, "cert.crt");
  }

  private static get keyPath(): string {
    return path.join(this.certficatesPath, "key.key");
  }

  public static isAvailble(): boolean {
    return fs.existsSync(this.certPath) && fs.existsSync(this.keyPath);
  }

  public static loadSSLCert(): SSLType | undefined {
    try {
      if (!this.isAvailble) {
        logger.warn("SSL certificate or key file not found!".bgYellow);
        return undefined;
      }

      const cert: Buffer = fs.readFileSync(this.certPath);

      const key: Buffer = fs.readFileSync(this.keyPath);

      return { cert, key };
    } catch (error) {
      logger.error("Error loading SSL Certificates", error);
      return undefined;
    }
  }
}
