import { logger } from "../config/logger";

export function methodTime() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    let originalMethod = descriptor.value!;

    descriptor.value = function (...args: any[]) {
      const startTime = Date.now();
      try {
        const result = originalMethod.apply(this, args);
        logger.info(
          `Initialized ${
            !propertyKey.endsWith("init")
              ? String(propertyKey.split("init")[1]).underline.cyan.bold + " "
              : ""
          }in:  ${
            Date.now() - startTime >= 20
              ? String(Date.now() - startTime + "ms").red
              : Date.now() - startTime >= 10
              ? String(Date.now() - startTime + "ms").yellow
              : String(Date.now() - startTime + "ms").green
          }`
        );
        return result;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw error;
      }
    };

    return descriptor;
  };
}
