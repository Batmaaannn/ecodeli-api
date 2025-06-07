import {
  CustomerUser,
  DeliveryAgentUser,
  MerchantUser,
  User,
  UserType,
} from "./user";
import { User as UserEntity } from "src/modules/users/entities/user.entity";
import { ServiceAgentUser } from "./user";

export function isMerchantUser(user: User | UserEntity): user is MerchantUser {
  if (!user || Object.keys(user).length === 0) return false;

  return (
    (Object.prototype.hasOwnProperty.call(user, "merchant_id") ||
      Object.prototype.hasOwnProperty.call(user, "merchant")) &&
    user.user_type === UserType.MERCHANT
  );
}

export function isDeliveryAgentUser(
  user: User | UserEntity
): user is DeliveryAgentUser {
  if (!user || Object.keys(user).length === 0) return false;

  return (
    (Object.prototype.hasOwnProperty.call(user, "delivery_agent_id") ||
      Object.prototype.hasOwnProperty.call(user, "delivery_agent")) &&
    user.user_type === UserType.DELIVERY_AGENT
  );
}

export function isServiceAgentUser(
  user: User | UserEntity
): user is ServiceAgentUser {
  if (!user || Object.keys(user).length === 0) return false;

  return (
    (Object.prototype.hasOwnProperty.call(user, "service_agent_id") ||
      Object.prototype.hasOwnProperty.call(user, "service_agent")) &&
    user.user_type === UserType.SERVICE_AGENT
  );
}

export function isCustomerUser(user: User | UserEntity): user is CustomerUser {
  if (!user || Object.keys(user).length === 0) return false;

  return (
    (Object.prototype.hasOwnProperty.call(user, "customer_id") ||
      Object.prototype.hasOwnProperty.call(user, "customer")) &&
    user.user_type === UserType.CUSTOMER
  );
}
