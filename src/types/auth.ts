import { UserType } from "./user";

export interface PayloadAuth {
  sub: string;
  email: string;
  userType: UserType;
}
