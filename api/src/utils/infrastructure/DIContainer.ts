type Factory<T> = (container: Container) => T;

export class Container {
  private bindings: Map<string, Factory<any>> = new Map<string, Factory<any>>();
  private instances: Map<string, any> = new Map<string, any>();

  public bind<T>(key: string, factory: Factory<T>, singelton = false): void {
    if (singelton) this.instances.set(key, factory(this));
    else this.bindings.set(key, factory);
  }

  public get<T>(key: string): T {
    if (this.instances.has(key)) return this.instances.get(key);

    const factory = this.bindings.get(key);
    if (!factory) throw new Error(`No binding found for key: ${key}`);

    return factory(this);
  }
}

export const container = new Container();
