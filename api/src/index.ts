import path from "path";

import "dotenv/config"

import colors from "colors";
import "./utils/infrastructure/bindings";
import express, { Express, Router } from "express";
import { routers } from "./REST/routes/routes";
import { errorHandler } from "./REST/middlewares/errorHandler";
import { PassportManager } from "./REST/services/auth/passport/PassportManager";
import { GoogleStrategyService } from "./REST/services/auth/strategies/GoogleStrategyService";
import {
  HTTPServer,
  HTTPSServer,
  MiddlewareManager,
} from "./utils/infrastructure";
import { CertificatesManager, EnvironmentManager } from "./utils/env";
import { methodTime } from "./utils/decorators";
import { InitializeConfigs, logger } from "./utils/config";
import { container } from "./utils/infrastructure/DIContainer";

colors.enabled;

class App {
  private _cert: SSLType | undefined;
  protected set cert(crt: SSLType | undefined) {
    if (!crt) {
      console.warn(
        "HTTPS Server cannot be initialized without proper SSL Certificate"
          .bgYellow
      );
    }

    this._cert = crt;
  }

  protected get cert() {
    return this._cert;
  }
  constructor(
    protected readonly app: Express = express(),
    private readonly routes: Router[] = routers,
    protected port: number = InitializeConfigs.preparePort()
  ) {}

  @methodTime()
  private initServer() {
    if (EnvironmentManager.isProduction()) {
      this.app.listen(this.port, () => {
        console.log(`App listen on port ${String(this.port).underline.yellow}`);
      });

      return;
    }

    new HTTPServer().initialize(this.app, this.port);

    if (CertificatesManager.isAvailble())
      this.cert = CertificatesManager.loadSSLCert();
    else this.cert = undefined;

    if (this.cert)
      new HTTPSServer().initialize(this.app, this.port + 1, this.cert);
  }

  @methodTime()
  private initMiddlewares() {
    MiddlewareManager.loadMiddlewares(this.app);
  }

  @methodTime()
  private initRoutes() {
    this.app.use("/api", express.static(path.join(__dirname, "../public")));
    this.routes.forEach((router) => this.app.use("/api", router));
  }

  @methodTime()
  public init() {
    const googleStrategy = container.get<GoogleStrategyService>(
      "GoogleStrategyService"
    );
    PassportManager.configureGoogleStrategy(googleStrategy);

    logger.log("info", colors.blue(InitializeConfigs.generateStartMessage()));

    this.initMiddlewares();
    this.initRoutes();
    this.app.use(errorHandler);
    this.initServer();
  }
}

new App().init();
