import { ChangesType } from "../types/user.types";

export interface IUserService {
  getPrivateData(userId: string): Promise<any>;

  getUserPublicData(userId: string): Promise<any>;

  modifyData(userId: string, changes: ChangesType): Promise<ReturnMessage>;

  deleteAccount(userId: string, password: string): Promise<ReturnMessage>;
}
