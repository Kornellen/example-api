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
type ServiceBinds = { token: string; repoToken: string; service: any }[];

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
    repoToken: "IUserRepository",
    service: GoogleStrategyService,
  },
  {
    token: "ClassicStrategyService",
    repoToken: "IUserRepository",
    service: ClassicStrategyService,
  },
  {
    token: "CommentService",
    repoToken: "ICommentRepository",
    service: CommentService,
  },
  { token: "PostService", repoToken: "IPostRepository", service: PostService },
  { token: "UserService", repoToken: "IUserRepository", service: UserService },
  {
    token: "WishlistService",
    repoToken: "IWishlistRepository",
    service: WishlistService,
  },
];

servicesBinds.forEach((servc) =>
  container.bind(servc.token, (c) => {
    logger.info(`Initializing Service: ${servc.token}`);
    const repo = c.get(servc.repoToken);

    return new servc.service(repo);
  })
);
export default {};
