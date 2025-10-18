import { Request, Response } from "express";

export const redirectToApi = (req: Request, res: Response, next: any) => {
  let newUrl = "";
  const regex = /(^|\/)api(\/|$)/;
  if (!regex.test(req.url)) {
    const host = req.headers.host;
    const originalPath = req.originalUrl;

    newUrl = `${req.protocol}://${host}/api${originalPath}`;

    return res.redirect(newUrl);
  }
  next();
};

export const redirectToHTTPS = (req: Request, res: Response, next: any) => {
  let newUrl = "";

  if (req.protocol !== "https" && process.env.NODE_ENV === "production") {
    const host = req.hostname;
    const path = req.path;

    newUrl = `https://${host}:5175${path}`;

    return res.redirect(newUrl);
  }
  next();
};
