import { EnvironmentManager } from "../env/EnvironmentManager";
import * as colors from "colors";
import { isNumber } from "../others/typeGuards";
export class InitializeConfigs {
  private static date = new Date();
  private static initConfigs = {
    time: this.date.toLocaleTimeString(),
    envIcon: EnvironmentManager.isDev() ? "🛠️" : " 🖥️",
    year: this.date.getFullYear(),
  };
  public static generateStartMessage() {
    return `\n
|-----------------------------------------------|
| Initializing Backend Service\t\t🔍\t|
|-----------------------------------------------|
| App Environment: ${
      EnvironmentManager.isDev()
        ? colors.red(EnvironmentManager.NODE_ENV)
        : colors.green(EnvironmentManager.NODE_ENV)
    }\t\t${this.initConfigs.envIcon}\t|
|-----------------------------------------------|
| Initialization Time: ${this.initConfigs.time}\t\t\t|
|-----------------------------------------------|
|© Kornellen ${this.initConfigs.year}\t\t\t|
|-----------------------------------------------|\n`;
  }

  public static preparePort() {
    const rawPort =
      Number(EnvironmentManager.loadEnvironmentVarible("PORT")) ?? 3000;
    return isNumber(rawPort) ? rawPort : 3000;
  }
}
