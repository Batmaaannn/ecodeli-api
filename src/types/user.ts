export enum UserType {
  ADMIN = "ADMIN",
  DELIVERY_AGENT = "DELIVERY_AGENT",
  SERVICE_AGENT = "SERVICE_AGENT",
  CUSTOMER = "CUSTOMER",
  MERCHANT = "MERCHANT",
}

interface BaseUser {
  id: number;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface AdminUser extends BaseUser {
  user_type: UserType.ADMIN;
}

export interface DeliveryAgentUser extends BaseUser {
  user_type: UserType.DELIVERY_AGENT;
}

export interface ServiceAgentUser extends BaseUser {
  user_type: UserType.SERVICE_AGENT;
}

export interface CustomerUser extends BaseUser {
  user_type: UserType.CUSTOMER;
}

export interface MerchantUser extends BaseUser {
  user_type: UserType.MERCHANT;
}

export type User =
  | AdminUser
  | DeliveryAgentUser
  | ServiceAgentUser
  | CustomerUser
  | MerchantUser;
