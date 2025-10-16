import path from "path";

import dotenv from "dotenv";
dotenv.config({ quiet: false });

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

colors.enabled;

class App {
  protected cert: SSLType | undefined = undefined;

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

    if (this.cert)
      new HTTPSServer().initialize(this.app, this.port + 1, this.cert);
    else {
      console.log(
        "HTTPS Server cannot be initialized without proper SSL Certificate"
          .bgYellow
      );
    }
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
    // console.clear();
    const googleStrategy = new GoogleStrategyService();
    PassportManager.configureGoogleStrategy(googleStrategy);

    logger.log("info", colors.blue(InitializeConfigs.generateStartMessage()));

    this.initMiddlewares();
    this.initRoutes();
    this.app.use(errorHandler);
    this.initServer();
  }
}

new App().init();
