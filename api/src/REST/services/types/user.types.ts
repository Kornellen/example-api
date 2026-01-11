import { Role, User } from "@app/db/models";

export type ChangesType = {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  city: string | null;
  age: string | null;
};

export interface UserPublic extends User {
  id: string;
  username: string;
  role: Role;
  email: string;
  _count: {
    comments: number;
  };
}

export interface UserPrivate extends UserPublic {
  first_name: string | null;
  last_name: string | null;
  city: string;
  age: number | null;
  loginMethod: {
    name: string;
  };
  _count: {
    comments: number;
    posts: number;
  };
}
