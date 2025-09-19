import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import dashboardRouter from "./dashboard.route";
import postRouter from "./post.routes";
import commentRouter from "./comment.routes";
import wishlistRouter from "./wishlist.routes";

export const routers = [
  authRouter,
  userRouter,
  dashboardRouter,
  postRouter,
  commentRouter,
  wishlistRouter,
];
