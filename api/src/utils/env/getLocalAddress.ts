import * as os from "os";

export const getLocalAddress = () => {
  const networkInterfaces = Object.values(os.networkInterfaces());

  const addresses: string[] = [];

  networkInterfaces.forEach((netInterface) => {
    netInterface?.forEach((config) => {
      if (config.family === "IPv4" && !config.internal) {
        addresses.push(config.address);
      }
    });
  });

  return addresses;
};
