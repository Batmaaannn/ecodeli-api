import { UserType } from "./User";

export interface PayloadAuth {
  sub: string;
  email: string;
  userType: UserType;
}
