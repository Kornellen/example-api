export class EnvironmentManager {
  public static loadEnvironmentVarible(key: string): string | undefined {
    return process.env[key];
  }

  public static get NODE_ENV(): string {
    return process.env.NODE_ENV ?? "production";
  }
  public static isDev(): boolean {
    return this.NODE_ENV === "development";
  }

  public static isProduction(): boolean {
    return this.NODE_ENV === "production";
  }
}
