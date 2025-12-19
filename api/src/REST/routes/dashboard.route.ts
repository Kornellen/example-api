import { Router } from "express";
import path from "path";

const dashboardRouter = Router();

dashboardRouter.get("/", (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../../../public/index.html"));
  } catch (error) {
    next(error);
  }
});

export default dashboardRouter;
