import {
  CommentRepository,
  PostRepository,
  UserRepository,
  WishlistRepository,
} from "@app/repositories";
import {
  CommentService,
  PostService,
  UserService,
  WishlistService,
} from "@app/services";
import { logger } from "../config";
import { container } from "./DIContainer";
import { GoogleStrategyService } from "src/REST/services/auth/strategies/GoogleStrategyService";
import { ClassicStrategyService } from "src/REST/services/auth/strategies/ClassicStrategyService";

type RepoBinds = { token: string; fact: () => any }[];
type ServiceBinds = { token: string; deps: string[]; service: any }[];

const reposBinds: RepoBinds = [
  {
    token: "ICommentRepository",
    fact: () => new CommentRepository(),
  },
  { token: "IPostRepository", fact: () => new PostRepository() },
  { token: "IUserRepository", fact: () => new UserRepository() },
  { token: "IWishlistRepository", fact: () => new WishlistRepository() },
];
reposBinds.forEach((repo) => container.bind(repo.token, repo.fact));

const servicesBinds: ServiceBinds = [
  {
    token: "GoogleStrategyService",
    deps: ["IUserRepository"],
    service: GoogleStrategyService,
  },
  {
    token: "ClassicStrategyService",
    deps: ["IUserRepository"],
    service: ClassicStrategyService,
  },
  {
    token: "CommentService",
    deps: ["ICommentRepository"],
    service: CommentService,
  },
  { token: "PostService", deps: ["IPostRepository"], service: PostService },
  {
    token: "UserService",
    deps: ["IUserRepository", "IPostRepository"],
    service: UserService,
  },
  {
    token: "WishlistService",
    deps: ["IWishlistRepository"],
    service: WishlistService,
  },
];

servicesBinds.forEach((servc) =>
  container.bind(servc.token, (c) => {
    logger.info(`Initializing Service: ${servc.token}`);

    const deps = servc.deps.map((dep) => c.get(dep));

    return new servc.service(...deps);
  })
);
export default {};
