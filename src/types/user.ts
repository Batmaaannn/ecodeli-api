import { Customer } from "src/modules/customers/entities/customer.entity";
import { DeliveryAgent } from "src/modules/delivery-agents/entities/delivery-agents.entity";
import { Merchant } from "src/modules/merchants/entities/merchants.entity";
import { ServiceAgent } from "src/modules/service-agents/entities/service-agents.entity";

export enum UserType {
  ADMIN = "ADMIN",
  DELIVERY_AGENT = "DELIVERY_AGENT",
  SERVICE_AGENT = "SERVICE_AGENT",
  CUSTOMER = "CUSTOMER",
  MERCHANT = "MERCHANT",
}

export enum AgentType {
  DELIVERY_AGENT = "DELIVERY_AGENT",
  SERVICE_AGENT = "SERVICE_AGENT",
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
  delivery_agent_id: number;
  delivery_agent: DeliveryAgent;
}

export interface ServiceAgentUser extends BaseUser {
  user_type: UserType.SERVICE_AGENT;
  service_agent_id: number;
  service_agent: ServiceAgent;
}

export interface CustomerUser extends BaseUser {
  user_type: UserType.CUSTOMER;
  customer_id: number;
  customer: Customer;
}

export interface MerchantUser extends BaseUser {
  user_type: UserType.MERCHANT;
  merchant_id: number;
  merchant: Merchant;
}

export type User =
  | AdminUser
  | DeliveryAgentUser
  | ServiceAgentUser
  | CustomerUser
  | MerchantUser;
